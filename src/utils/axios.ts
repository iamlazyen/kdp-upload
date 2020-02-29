interface AxiosConfig {
  url: string;
  method: 'get' | 'post';
  data?: any;
  params?: any;
  headers?: any;
  onUploadProgress?: (progressEvent: any) => void;
}

export default function axios(config: AxiosConfig) {
  return new Promise((resolve, reject) => {
    const {
      data, url, method = 'post', headers = {}, onUploadProgress,
    } = config;
    const xhr = new XMLHttpRequest();

    if (onUploadProgress) {
      xhr.upload.onprogress = onUploadProgress;
    }

    xhr.open(method, url);
    Object.keys(headers).forEach((key) => {
      xhr.setRequestHeader(key, headers[key]);
    });
    xhr.send(data);

    xhr.onload = (e) => {
      resolve({
        data: e,
      });
    };

    xhr.onerror = (err) => {
      reject(err);
    };
  });
}
