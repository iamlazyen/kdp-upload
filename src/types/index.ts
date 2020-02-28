
export interface UploadFile {
  id: number;
  name: string;
  size: number;
  file: File;
  chunks: Chunk[];
  start: string; // TODO: how to design this type, formate string
  end: string;
}

export interface Chunk {
  file: Blob;
}
