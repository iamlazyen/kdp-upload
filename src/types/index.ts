
export interface UploadFile {
  id: number;
  name: string;
  size: number;
  file: File;
  chunks: Chunk[];
  start: string; // TODO: how to design this type, formate string
  end: string;
  status: Status;
}

export interface Chunk {
  file: Blob;
}

export enum Status {
  Ready = 'ready',
  Uploading = 'uploading',
  Pause = 'pause',
  Success = 'success'
}
