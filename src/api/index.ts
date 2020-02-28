import axios from '../utils/axios';
import { Chunk } from '../types/index';

interface MergeData {
  fileName: string;
}

export function requestChunk(data: Chunk) {
  return axios({
    url: '/chunk',
    data,
    method: 'post',
  });
}

export function mergeRequest(data: MergeData) {
  return axios({
    url: '/merge',
    method: 'post',
    data,
  });
}
