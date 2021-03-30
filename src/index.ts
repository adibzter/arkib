const axios = require('axios').default;

import parser from 'fast-xml-parser';
import { htmlToText } from 'html-to-text';

const hidsData = require('./hids-urls');

// Get one today's history
const getEventToday = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;

  // Change this any into appropriate type safe interface later
  return axios.post(hidsData.getEventUrl(day, month)).then(({ data }: any) => {
    let descBm = data.description_bm;
    let descEn = data.description_eng;
    let new_data;

    descBm = cleanDescription(descBm);
    descEn = cleanDescription(descEn);

    new_data = { ...data, description_bm: descBm, description_eng: descEn };

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

  let dataList: any[] = [];

  // Get first page
  // Change this any into appropriate type safe interface later
  await axios
    .post(hidsData.getAllEventsUrl(day, month, currentPage))
    .then(({ data: res }: any) => {
      dataList = [...res.data];
      lastPage = res.last_page;
      lastNumber = res.data[res.data.length - 1]['no'];

      currentPage++;
    })
    .catch((err: Error) => console.error(err));

  // Get the rest of pages
  for (; currentPage <= lastPage; currentPage++) {
    // Change this any into appropriate type safe interface later
    await axios
      .post(hidsData.getAllEventsUrl(day, month, currentPage))
      .then(({ data: res }: any) => {
        res = res.data.map((data: any) => ({ ...data, no: ++lastNumber }));
        dataList = [...dataList, ...res];
      })
      .catch((err: Error) => console.error(err));
  }

  return new Promise((resolve, reject) => {
    if (dataList) resolve(dataList);
    reject('Cannot fetch data');
  });
};

// Change this any into appropriate type safe interface later
const cleanDescription = (desc: any) => {
  // Description does not exists
  if (!desc) return;

  // Check for dynamic-content
  if (desc.match(/^<dynamic-content/g)) {
    desc += ']]>';

    const options = {
      cdataTagname: '__cdata',
    };
    // @ts-ignore
    desc = parser.convertToJson(parser.getTraversalObj(desc, options), options)[
      'dynamic-content'
    ];
  }
  desc = htmlToText(desc, { wordwrap: false }).trim();

  return desc;
};

module.exports = { getEventToday, getAllEventsToday };
