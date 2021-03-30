const axios = require('axios').default;

const parser = require('fast-xml-parser');
const { htmlToText } = require('html-to-text');

const hidsData = require('./hids-urls');

// Get one today's history
const getEventToday = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;

  return axios.post(hidsData.getEventUrl(day, month)).then(({ data }) => {
    let descBm = data.description_bm;
    let descEn = data.description_eng;

    descBm = cleanDescription(descBm);
    descEn = cleanDescription(descEn);

    new_data = { ...data, description_bm: descBm, description_eng: descEn };

    return new_data;
  });
};

const getAllEventsToday = async (day, month) => {
  let currentPage = 1;
  let lastPage = 1;
  let lastNumber = 0;

  let dataList = [];

  // Get first page
  await axios
    .post(hidsData.getAllEventsUrl(day, month, currentPage))
    .then(({ data: res }) => {
      dataList = [...res.data];
      lastPage = res.last_page;
      lastNumber = res.data[res.data.length - 1]['no'];

      currentPage++;
    })
    .catch((err) => console.error(err));

  // Get the rest of pages
  for (; currentPage <= lastPage; currentPage++) {
    await axios
      .post(hidsData.getAllEventsUrl(day, month, currentPage))
      .then(({ data: res }) => {
        res = res.data.map((data) => ({ ...data, no: ++lastNumber }));
        dataList = [...dataList, ...res];
      })
      .catch((err) => console.error(err));
  }

  return new Promise((resolve, reject) => {
    if (dataList) resolve(dataList);
    reject('Cannot fetch data');
  });
};

const cleanDescription = (desc) => {
  // Description does not exists
  if (!desc) return;

  // Check for dynamic-content
  if (desc.match(/^<dynamic-content/g)) {
    desc += ']]>';

    const options = {
      cdataTagname: '__cdata',
    };
    desc = parser.convertToJson(parser.getTraversalObj(desc, options), options)[
      'dynamic-content'
    ];
  }
  desc = htmlToText(desc, { wordwrap: false }).trim();

  return desc;
};

module.exports = { getEventToday, getAllEventsToday };
