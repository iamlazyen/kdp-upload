import dayjs from 'dayjs';

function dateStr(date: Date) {
  return dayjs(date).format('YYYY-MM-DD HH:mm');
}

function test() {
  return 'a';
}

export {
  dateStr,
  test,
};
