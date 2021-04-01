"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const axios_1 = __importDefault(require("axios"));
const fast_xml_parser_1 = __importDefault(require("fast-xml-parser"));
const html_to_text_1 = require("html-to-text");
const hids_urls_1 = __importDefault(require("./hids-urls"));
const date = new Date();
// Get one today's history
const getEventToday = async () => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    // Change this any into appropriate type safe interface later
    let data;
    try {
        data = await axios_1.default.post(hids_urls_1.default.getEventUrl(day, month));
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
        console.error(err);
        throw 'Cannot fetch data';
    }
};
const getAllEventsToday = async () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
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
    })
        .catch((err) => console.error(err));
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
        console.error(err);
        throw 'Cannot fetch data';
    }
    results.map(({ data }) => {
        data = data.data;
        data.map((el) => dataList.push(Object.assign(Object.assign({}, el), { no: ++lastNumber })));
    });
    return dataList;
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
module.exports = { getEventToday, getAllEventsToday };
