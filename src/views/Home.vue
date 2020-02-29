<template>
  <div class="upload">
    <el-button type="primary" @click="selectFiles">上传文件</el-button>
    <input type="file" multiple class="upload-hidden" ref="uploadBtn" @change="confirmFiles">
    <el-table
      class="mt"
      border
      :data="selectedFiles"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="name"
        label="文件名"
        width="180">
      </el-table-column>
      <el-table-column
        label="文件大小">
        <template slot-scope="$scope">
          <span>{{$scope.row.size | getBytes}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态">
      </el-table-column>
      <el-table-column
        prop="start"
        label="开始时间">
      </el-table-column>
      <el-table-column label="结束时间">
        <template slot-scope="$scope">
          <span>{{$scope.row.end}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { UploadFile, Chunk, Status } from '../types/index';
import { dateStr, getBytes } from '../utils';
import { requestChunk, mergeRequest } from '../api/index';

const SIZE = 10 * 1024 * 1024;

@Component({
  name: 'Home',
  filters: {
    getBytes,
  },
})
export default class Home extends Vue {
  selectedFiles: UploadFile [] = []

  selectFiles() {
    const clickEvent = new MouseEvent('click');
    (this.$refs.uploadBtn as Element).dispatchEvent(clickEvent);
  }

  confirmFiles(e: Event) {
    const target = e.target as HTMLInputElement;
    const fileList = Array.from(target.files as FileList);
    if (!fileList || fileList.length === 0) return;

    this.uploadFiles(fileList);
  }

  uploadFiles(fileList: File[]) {
    this.selectedFiles = fileList.map((rawFile) => this.enrichFile(rawFile));
    this.selectedFiles.forEach(async (file) => {
      await this.beforeUploadFile(file);
      this.uploadFile(file);
    });
  }

  enrichFile(rawFile: File): UploadFile {
    const result = Object.create(null);

    result.file = rawFile;
    result.start = dateStr(new Date());
    result.name = rawFile.name;
    result.size = rawFile.size;
    result.chunks = this.buildChunks(result.file).map((chunk) => this.enrichChunk(chunk, result));
    result.end = '-';
    result.status = Status.Ready;
    result.hash = '';
    return result;
  }

  buildChunks(rawFile: File, size = SIZE) {
    const result: Blob[] = [];
    let cur = 0;
    while (cur < rawFile.size) {
      const maxSize = Math.min(rawFile.size, cur + size);
      const chunk = rawFile.slice(cur, maxSize);

      result.push(chunk);
      cur += size;
    }
    return result;
  }

  enrichChunk(chunk: Blob, file: UploadFile): Chunk {
    const result = {} as Chunk;
    result.file = chunk;
    result.name = file.name;
    result.hash = `${file.name}-${Math.floor(Math.random() * 100)}`;

    return result;
  }

  async beforeUploadFile(file: UploadFile) {
    file.status = Status.Watting;
    file.hash = await this.calculateHash(file.chunks);
  }

  calculateHash(chunkList: Chunk[]): Promise<string> {
    return new Promise((resolve) => {
      const worker = new Worker('/hash.js');
      worker.postMessage({ chunkList });
      worker.onmessage = (e) => {
        const { percentage, hash } = e.data;
        console.log(percentage, hash);
        if (hash) {
          resolve(hash);
        }
      };
    });
  }

  async uploadFile(file: UploadFile) {
    file.status = Status.Uploading;
    console.log(file);
    const chunksRequest = file.chunks.map((chunk) => requestChunk(chunk));
    await Promise.all(chunksRequest);
    await mergeRequest({ fileName: file.name, size: file.size, hash: file.hash });
  }
}

</script>
<style lang='scss'>
.upload {
  .mt {
    margin-top: 20px;
  }
  &-hidden {
    position: absolute;
    clip: rect(0, 0, 0, 0);
    z-index: -1;
  }
}
</style>
