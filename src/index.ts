import axios from 'axios';

import parser from 'fast-xml-parser';
import { htmlToText } from 'html-to-text';

import hidsData from './hids-urls';

const date = new Date();

// Get one today's history
const getEventToday = async () => {
  const day: number = date.getDate();
  const month: number = date.getMonth() + 1;

  // Change this any into appropriate type safe interface later
  let data: any;

  try {
    data = await axios.post(hidsData.getEventUrl(day, month));
    let new_data: object;

    // Should be string
    let descBm: any = data.description_bm;
    let descEn: any = data.description_eng;

    descBm = cleanDescription(descBm);
    descEn = cleanDescription(descEn);

    new_data = { ...data, description_bm: descBm, description_eng: descEn };

    return new_data;
  } catch (err) {
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
  let pages: object[] = [];
  while (currentPage <= lastPage) {
    // Change this any into appropriate type safe interface later
    pages.push(axios.post(hidsData.getAllEventsUrl(day, month, currentPage)));
    currentPage++;
  }

  let results: object[] = [];
  try {
    results = await Promise.all(pages);
  } catch (err) {
    console.error(err);
    throw 'Cannot fetch data';
  }

  results.map(({ data }: any) => {
    data = data.data;
    data.map((el: object) => dataList.push({ ...el, no: ++lastNumber }));
  });

  return dataList;
};

const cleanDescription = (desc: string) => {
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

export = { getEventToday, getAllEventsToday };
