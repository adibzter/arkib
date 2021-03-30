"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require("axios").default;
const fast_xml_parser_1 = __importDefault(require("fast-xml-parser"));
const html_to_text_1 = require("html-to-text");
const hidsData = require("./hids-urls");
// Get one today's history
const getEventToday = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    // Change this any into appropriate type safe interface later
    return axios.post(hidsData.getEventUrl(day, month)).then(({ data }) => {
        let descBm = data.description_bm;
        let descEn = data.description_eng;
        let new_data;
        descBm = cleanDescription(descBm);
        descEn = cleanDescription(descEn);
        new_data = Object.assign(Object.assign({}, data), { description_bm: descBm, description_eng: descEn });
        return new_data;
    });
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
    await axios
        .post(hidsData.getAllEventsUrl(day, month, currentPage))
        .then(({ data: res }) => {
        dataList = [...res.data];
        lastPage = res.last_page;
        lastNumber = res.data[res.data.length - 1]["no"];
        currentPage++;
    })
        .catch((err) => console.error(err));
    // Get the rest of pages
    for (; currentPage <= lastPage; currentPage++) {
        // Change this any into appropriate type safe interface later
        await axios
            .post(hidsData.getAllEventsUrl(day, month, currentPage))
            .then(({ data: res }) => {
            res = res.data.map((data) => (Object.assign(Object.assign({}, data), { no: ++lastNumber })));
            dataList = [...dataList, ...res];
        })
            .catch((err) => console.error(err));
    }
    return new Promise((resolve, reject) => {
        if (dataList)
            resolve(dataList);
        reject("Cannot fetch data");
    });
};
// Change this any into appropriate type safe interface later
const cleanDescription = (desc) => {
    // Description does not exists
    if (!desc)
        return;
    // Check for dynamic-content
    if (desc.match(/^<dynamic-content/g)) {
        desc += "]]>";
        const options = {
            cdataTagname: "__cdata",
        };
        // @ts-ignore
        desc = fast_xml_parser_1.default.convertToJson(fast_xml_parser_1.default.getTraversalObj(desc, options), options)["dynamic-content"];
    }
    desc = html_to_text_1.htmlToText(desc, { wordwrap: false }).trim();
    return desc;
};
module.exports = { getEventToday, getAllEventsToday };
//# sourceMappingURL=index.js.map