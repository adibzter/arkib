const axios = require('axios');

const parser = require('fast-xml-parser');
const { htmlToText } = require('html-to-text');

const hidsData = require('./hids-urls');

// Get one today's history
const getEventToday = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;

  return axios
    .post(hidsData.getEventUrl(day, month))
    .then(({ data }) => {
      let descBm = data.description_bm;
      let descEn = data.description_eng;

      descBm = cleanDescription(descBm);
      descEn = cleanDescription(descEn);

      new_data = { ...data, description_bm: descBm, description_eng: descEn };

      return new_data;
    })
    .catch((err) => err);
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

module.exports = { getEventToday };
