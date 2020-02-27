<template>
  <div class="upload">
    <el-button type="primary" @click="selectFiles">上传文件</el-button>
    <input type="file" multiple class="upload-hidden" ref="uploadBtn" @change="confirmFiles">
    <el-table
      class="mt"
      border
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import { UploadFile, Table, Chunk } from '../types/index';


const SIZE = 10 * 1024 * 1024;


export default class Home extends Vue {
  tableData: Table[] = [{
    date: '2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄',
  }, {
    date: '2016-05-04',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1517 弄',
  }, {
    date: '2016-05-01',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1519 弄',
  }, {
    date: '2016-05-03',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1516 弄',
  }];

  selectedFiles: File [] = []

  selectFiles() {
    const clickEvent = new MouseEvent('click');
    (this.$refs.uploadBtn as Element).dispatchEvent(clickEvent);
  }

  confirmFiles(event: any) {
    this.selectedFiles = Array.from(event.target.files);
    if (!this.selectedFiles || this.selectedFiles.length === 0) return;

    this.uploadFiles();
  }

  uploadFiles() {
    this.selectedFiles.forEach((file: File) => {
      this.uploadFile(file);
    });
  }

  uploadFile(rawFile: File) {
    const file = this.enrichFile(rawFile);
    console.log(file);
  }

  enrichFile(rawFile: File) {
    const result = {} as UploadFile;
    result.file = rawFile;
    result.name = rawFile.name;
    result.size = rawFile.size;
    result.chunks = this.buildChunks(result.file);

    return result;
  }


  buildChunks(rawFile: File, size = SIZE) {
    const result: Chunk[] = [];
    let cur = 0;
    while (cur < rawFile.size) {
      const maxSize = Math.min(rawFile.size, cur + size);
      const chunk = rawFile.slice(cur, maxSize);

      result.push({ file: chunk });
      cur += size;
    }
    return result;
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
