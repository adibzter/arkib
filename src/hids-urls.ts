// hids -> Hari Ini Dalam Sejarah (https://hids.arkib.gov.my)

const getEventUrl = (day: string, month: string) =>
  `http://hids.arkib.gov.my/api/site/today_event?day=${day}&month=${month}`;

const getAllEventsUrl = (day: string, month: string, page = 1) =>
  `http://hids.arkib.gov.my/api/site/today_other_events?day=${day}&month=${month}&page=${page}`;

const getSampleVideoUrl = (id: string) =>
  `http://hids.arkib.gov.my/api/site/load_sample_video/${id}`;

module.exports = {
  getEventUrl,
  getAllEventsUrl,
  getSampleVideoUrl,
};
