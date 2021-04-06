// hids -> Hari Ini Dalam Sejarah (https://hids.arkib.gov.my)

const getEventUrl = (day: number, month: number): string =>
  `http://hids.arkib.gov.my/api/site/today_event?day=${day}&month=${month}`;

const getAllEventsUrl = (
  day: number,
  month: number,
  page: number = 1
): string =>
  `http://hids.arkib.gov.my/api/site/today_other_events?day=${day}&month=${month}&page=${page}`;

const getSampleVideoUrl = (id: number): string =>
  `http://hids.arkib.gov.my/api/site/load_sample_video/${id}`;

const getVideoDetailsUrl = (id: number, language: 'bm' | 'eng'): string =>
  `http://hids.arkib.gov.my/api/site/vod_detail?id=${id}&lang=${language}`;

export = {
  getEventUrl,
  getAllEventsUrl,
  getSampleVideoUrl,
  getVideoDetailsUrl,
};
