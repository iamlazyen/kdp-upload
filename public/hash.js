self.importScripts('/spark-md5.min.js');

self.onmessage = (e) => {
  const { chunkList } = e.data;

  const spark = new self.SparkMD5.ArrayBuffer();
  let percentage = 0;
  let count = 0;

  const loadNext = (index) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(chunkList[index].file);
    reader.onload = (e) => {
      count++;
      spark.append(e.target.result);
      if (count === chunkList.length) {
        self.postMessage({
          percentage: 100,
          hash: spark.end(),
        });
      } else {
        percentage += 100 / chunkList.length;
        self.postMessage({
          percentage,
        });
        loadNext(count);
      }
    };
  };

  loadNext(0);
};
