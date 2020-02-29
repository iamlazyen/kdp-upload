import axios from '../utils/axios';
import { Chunk } from '../types/index';


interface MergeData {
  fileName: string;
  size: number;
  hash: string;
}

export function requestChunk(data: Chunk, onUploadProgress: (e: any) => void) {
  const formDate = new FormData();
  Object.keys(data).forEach((key) => formDate.append(key, data[key]));
  return axios({
    url: 'http://localhost:3000/chunk',
    data: formDate,
    method: 'post',
    onUploadProgress,
  });
}

export function mergeRequest(data: MergeData) {
  return axios({
    url: 'http://localhost:3000/merge',
    method: 'post',
    data: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  });
}
