"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const fast_xml_parser_1 = __importDefault(require("fast-xml-parser"));
const html_to_text_1 = require("html-to-text");
const hids_urls_1 = __importDefault(require("./hids-urls"));
const date = new Date();
const HOST = 'https://hids.arkib.gov.my';
// Get one history of specified date
const getEventByDate = async (day, month) => {
    return getEvent(day, month);
};
// Get one today's history
const getEventToday = async () => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return getEvent(day, month);
};
// Get one history
const getEvent = async (day, month) => {
    // Change this any into appropriate type safe interface later
    let data;
    try {
        data = (await axios_1.default.post(hids_urls_1.default.getEventUrl(day, month))).data;
        let new_data;
        // Should be string
        let descBm = data.description_bm;
        let descEn = data.description_eng;
        descBm = cleanDescription(descBm);
        descEn = cleanDescription(descEn);
        new_data = Object.assign(Object.assign({}, data), { description_bm: descBm, description_eng: descEn });
        return new_data;
    }
    catch (err) {
        throw 'Cannot fetch data';
    }
};
const getAllEventsByDate = async (day, month) => {
    return getAllEvents(day, month);
};
const getAllEventsToday = async () => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return getAllEvents(day, month);
};
const getAllEvents = async (day, month) => {
    let currentPage = 1;
    let lastPage = 1;
    let lastNumber = 0;
    let dataList = [];
    // Get first page
    // Change this any into appropriate type safe interface later
    await axios_1.default
        .post(hids_urls_1.default.getAllEventsUrl(day, month, currentPage))
        .then(({ data: res }) => {
        dataList = [...res.data];
        lastPage = res.last_page;
        lastNumber = res.data[res.data.length - 1]['no'];
        currentPage++;
    });
    // Get the rest of pages
    let pages = [];
    while (currentPage <= lastPage) {
        // Change this any into appropriate type safe interface later
        pages.push(axios_1.default.post(hids_urls_1.default.getAllEventsUrl(day, month, currentPage)));
        currentPage++;
    }
    let results = [];
    try {
        results = await Promise.all(pages);
    }
    catch (err) {
        throw 'Cannot fetch data';
    }
    results.map(({ data }) => {
        data = data.data;
        // @ts-ignore
        data.map((el) => dataList.push(Object.assign(Object.assign({}, el), { no: ++lastNumber })));
    });
    return dataList;
};
const getVideoDetails = async (id, language, options) => {
    // Change this any into appropriate type safe interface later
    let data;
    try {
        data = (await axios_1.default.post(hids_urls_1.default.getVideoDetailsUrl(id, language))).data;
        let new_data;
        // Should be string
        let descBm = data.description_bm;
        let descEn = data.description_eng;
        descBm = cleanDescription(descBm);
        descEn = cleanDescription(descEn);
        new_data = Object.assign(Object.assign({}, data), { url: data.fullvideo.url, description_bm: descBm, description_eng: descEn, lkp_era: {
                thumbnail: `${HOST}${data.lkp_era.thumbnail}`,
            } });
        // Download video
        if (options) {
            let ids = new_data.url.split('/');
            let id = +ids[ids.length - 1];
            const res = await downloadVideo(id, options.location, options.fileName);
            console.log(res);
        }
        return new_data;
    }
    catch (err) {
        throw 'Cannot fetch data';
    }
};
// Download Video
const downloadVideo = async (id, location, fileName) => {
    // No savePath
    if (!location)
        throw 'Save location not specified';
    // No file name
    if (!fileName)
        fileName = id.toString();
    location = `${location}/${fileName}.mp4`;
    try {
        const res = await axios_1.default.get(hids_urls_1.default.getSampleVideoUrl(id), {
            responseType: 'stream',
        });
        // Video not exists
        if (!res)
            throw 'Video not exists';
        // Create stream to write into file
        const writeStream = fs_1.default.createWriteStream(location);
        // Piping data into file
        res.data.pipe(writeStream);
        // Wait until finish piping
        location = await new Promise((resolve) => {
            writeStream
                .on('ready', () => console.log('Download Started...'))
                .on('error', (err) => {
                throw err;
            })
                .on('finish', () => {
                console.log('Download Finished');
                console.log(`File location: ${location}`);
                resolve(location);
            });
        });
        return location;
    }
    catch (err) {
        throw 'Failed to download video';
    }
};
const cleanDescription = (desc) => {
    // Description does not exists
    if (!desc)
        return;
    // Check for dynamic-content
    if (desc.match(/^<dynamic-content/g)) {
        desc += ']]>';
        const options = {
            cdataTagname: '__cdata',
        };
        // @ts-ignore
        desc = fast_xml_parser_1.default.convertToJson(fast_xml_parser_1.default.getTraversalObj(desc, options), options)['dynamic-content'];
    }
    desc = html_to_text_1.htmlToText(desc, { wordwrap: false }).trim();
    return desc;
};
module.exports = {
    getEventToday,
    getAllEventsToday,
    getEventByDate,
    getAllEventsByDate,
    getVideoDetails,
    downloadVideo,
};
