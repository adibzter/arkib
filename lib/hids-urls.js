"use strict";
// hids -> Hari Ini Dalam Sejarah (https://hids.arkib.gov.my)
const getEventUrl = (day, month) => `http://hids.arkib.gov.my/api/site/today_event?day=${day}&month=${month}`;
const getAllEventsUrl = (day, month, page = 1) => `http://hids.arkib.gov.my/api/site/today_other_events?day=${day}&month=${month}&page=${page}`;
const getSampleVideoUrl = (id) => `http://hids.arkib.gov.my/api/site/load_sample_video/${id}`;
module.exports = {
    getEventUrl,
    getAllEventsUrl,
    getSampleVideoUrl,
};
