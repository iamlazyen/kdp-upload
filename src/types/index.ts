
export interface UploadFile {
  id: number;
  name: string;
  size: number;
  file: File;
  chunks: Chunk[];
  start: string; // TODO: how to design this type, formate string
  end: string;
  status: Status;
  hash: string;
}

export interface Chunk {
  file: Blob;
  name: string;
  [property: string]: any;
}

export enum Status {
  Ready = 'ready',
  Watting = 'watting',
  Uploading = 'uploading',
  Pause = 'pause',
  Success = 'success'
}
