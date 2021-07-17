"use strict";
// hids -> Hari Ini Dalam Sejarah (https://hids.arkib.gov.my)
var getEventUrl = function (day, month) {
    return "http://hids.arkib.gov.my/api/site/today_event?day=" + day + "&month=" + month;
};
var getAllEventsUrl = function (day, month, page) {
    if (page === void 0) { page = 1; }
    return "http://hids.arkib.gov.my/api/site/today_other_events?day=" + day + "&month=" + month + "&page=" + page;
};
var getSampleVideoUrl = function (id) {
    return "http://hids.arkib.gov.my/api/site/load_sample_video/" + id;
};
var getVideoDetailsUrl = function (id, language) {
    return "http://hids.arkib.gov.my/api/site/vod_detail?id=" + id + "&lang=" + language;
};
module.exports = {
    getEventUrl: getEventUrl,
    getAllEventsUrl: getAllEventsUrl,
    getSampleVideoUrl: getSampleVideoUrl,
    getVideoDetailsUrl: getVideoDetailsUrl,
};
