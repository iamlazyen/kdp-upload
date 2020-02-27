export interface UploadFile {
  name: string;
  size: number;
  file: File;
  chunks: Chunk[];
}

export interface Table {
  date: string;
  name: string;
  address: string;
}

export interface Chunk {
  file: Blob;
}
