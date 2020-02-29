const http = require('http');
const multiparty = require('multiparty');
const fse = require('fs-extra');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, 'target');
const server = http.createServer();

const resolvePost = (req) => new Promise((resolve) => {
  let chunk = '';
  req.on('data', (data) => {
    chunk += data;
  });
  req.on('end', () => {
    resolve(JSON.parse(chunk));
  });
});

const pipeStream = (filename, writeStream) => new Promise((resolve) => {
  const readStream = fse.createReadStream(filename);
  readStream.on('end', () => {
    fse.unlinkSync(filename);
    resolve();
  });
  readStream.pipe(writeStream);
});

/**
 *
 * @param {stirng} filePath 创建文件名, 为hash
 * @param {*} fileName 文件原来的名字
 * @param {*} size 问价大小
 */
const mregeChunks = async (filePath, fileName, size) => {
  const chunkDir = path.resolve(ROOT_DIR, fileName);
  const chunkPaths = await fse.readdir(chunkDir);

  chunkPaths.sort((a, b) => a.split('-')[1] - b.split('-')[1]);
  await Promise.all(
    chunkPaths.map(
      (chunkPath, index) => pipeStream(
        path.resolve(chunkDir, chunkPath),
        fse.createWriteStream(filePath, {
          start: index * size,
          end: (index + 1) * size,
        }),
      ),
    ),
  );
  fse.rmdirSync(chunkDir);
};
const suffixFor = (filename) => {
  const markIndex = filename.lastIndexOf('.')[1];
  if (markIndex !== -1) {
    return filename.slice(markIndex + 1);
  }
};

server.on('request', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.status = 200;
    res.end();
    return;
  }

  if (req.url === '/merge') {
    const data = await resolvePost(req);
    const { fileName, size, hash } = data;
    // TODO: next fileName rename hash
    const filePath = path.resolve(ROOT_DIR, `${hash}.${suffixFor(fileName)}`);
    await mregeChunks(filePath, fileName, size);
    res.end(JSON.stringify({
      code: 0,
      message: 'file merge success',
    }));
  }

  const multipart = new multiparty.Form();
  multipart.parse(req, async (err, fields, files) => {
    if (err) return;
    const [fileName] = fields.name;
    const [hash] = fields.hash;
    const [chunk] = files.file;
    const chunkDir = path.resolve(ROOT_DIR, fileName);

    if (!fse.exists(chunkDir)) {
      await fse.mkdir(chunkDir);
    }

    await fse.move(chunk.path, `${chunkDir}/${hash}`);
    res.end('chunk is uploaded');
  });
});

server.listen(3000, () => console.log('正在监听 3000 端口'));
