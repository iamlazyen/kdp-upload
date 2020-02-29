import dayjs from 'dayjs';

function dateStr(date: Date) {
  return dayjs(date).format('YYYY-MM-DD HH:mm');
}

/** eslint-disabled */
const getBytes = (bytes: number) => {
  const sufixes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return !bytes && '0 Bytes' || `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sufixes[i]}`;
};

export {
  dateStr,
  getBytes,
};
