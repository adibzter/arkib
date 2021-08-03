import fs from 'fs';

import axios from 'axios';
import parser from 'fast-xml-parser';
import { htmlToText } from 'html-to-text';

import hidsUrl from './hids-urls';
import {
  VideoDetailsInterface,
  DownloadVideo,
} from './interfaces/VideoDetailsInterface';
import {
  EventTodayInterface,
  AllEventsTodayInterface,
} from './interfaces/EventTodayInterface';

const HOST = 'https://hids.arkib.gov.my';

// Get one history of specified date
const getEventByDate = async (day: number, month: number) => {
  return getEvent(day, month);
};

// Get one today's history
const getEventToday = async () => {
  const date = new Date();
  const day: number = date.getDate();
  const month: number = date.getMonth() + 1;

  return getEvent(day, month);
};

// Get one history
const getEvent = async (
  day: number,
  month: number
): Promise<EventTodayInterface> => {
  // Change this any into appropriate type safe interface later
  let data: any;

  try {
    data = (await axios.post(hidsUrl.getEventUrl(day, month))).data;
    let new_data: EventTodayInterface;

    // Should be string
    let descBm: any = data.description_bm;
    let descEn: any = data.description_eng;

    descBm = cleanDescription(descBm);
    descEn = cleanDescription(descEn);

    new_data = { ...data, description_bm: descBm, description_eng: descEn };

    return new_data;
  } catch (err) {
    throw 'Cannot fetch data';
  }
};

const getAllEventsByDate = async (day: number, month: number) => {
  return getAllEvents(day, month);
};

const getAllEventsToday = async () => {
  const date = new Date();
  const day: number = date.getDate();
  const month: number = date.getMonth() + 1;

  return getAllEvents(day, month);
};

const getAllEvents = async (
  day: number,
  month: number
): Promise<Array<AllEventsTodayInterface>> => {
  let currentPage = 1;
  let lastPage = 1;
  let lastNumber = 0;

  let dataList: AllEventsTodayInterface[] = [];

  // Get first page
  // Change this any into appropriate type safe interface later
  await axios
    .post(hidsUrl.getAllEventsUrl(day, month, currentPage))
    .then(({ data: res }: any) => {
      dataList = [...res.data];
      lastPage = res.last_page;
      lastNumber = res.data[res.data.length - 1]['no'];

      currentPage++;
    });

  // Get the rest of pages
  let pages: object[] = [];
  while (currentPage <= lastPage) {
    // Change this any into appropriate type safe interface later
    pages.push(axios.post(hidsUrl.getAllEventsUrl(day, month, currentPage)));
    currentPage++;
  }

  let results: object[] = [];
  try {
    results = await Promise.all(pages);
  } catch (err) {
    throw 'Cannot fetch data';
  }

  results.map(({ data }: any) => {
    data = data.data;
    // @ts-ignore
    data.map((el: object) => dataList.push({ ...el, no: ++lastNumber }));
  });

  return dataList;
};

const getVideoDetails = async (
  id: number,
  language: 'bm' | 'eng',
  options?: DownloadVideo
): Promise<VideoDetailsInterface> => {
  // Change this any into appropriate type safe interface later
  let data: any;

  try {
    data = (await axios.post(hidsUrl.getVideoDetailsUrl(id, language))).data;
    let new_data: VideoDetailsInterface;

    // Should be string
    let descBm: any = data.description_bm;
    let descEn: any = data.description_eng;

    descBm = cleanDescription(descBm);
    descEn = cleanDescription(descEn);

    new_data = {
      ...data,
      url: data.fullvideo.url,
      description_bm: descBm,
      description_eng: descEn,
      lkp_era: {
        thumbnail: `${HOST}${data.lkp_era.thumbnail}`,
      },
    };

    // Download video
    if (options) {
      let ids: string[] = new_data.url.split('/');
      let id = +ids[ids.length - 1];

      const res = await downloadVideo(id, options.savePath, options.fileName);
      new_data = {
        ...new_data,
        file_path: res,
      };
    }

    return new_data;
  } catch (err) {
    throw 'Cannot fetch data';
  }
};

// Download Video
const downloadVideo = async (
  id: number,
  savePath: string = '.',
  fileName: string = id.toString()
): Promise<string> => {
  savePath = `${savePath}/${fileName}.mp4`;

  try {
    const res = await axios.get(hidsUrl.getSampleVideoUrl(id), {
      responseType: 'stream',
    });

    // Video not exists
    if (!res) throw 'Video not exists';

    // Create stream to write into file
    const writeStream = fs.createWriteStream(savePath);

    // Piping data into file
    res.data.pipe(writeStream);

    // Wait until finish piping
    savePath = await new Promise((resolve) => {
      writeStream
        .on('ready', () => console.log('Download Started...'))
        .on('error', (err) => {
          throw err;
        })
        .on('finish', () => {
          console.log('Download Finished');
          console.log(`File location: ${savePath}`);
          resolve(savePath);
        });
    });

    return savePath;
  } catch (err) {
    throw 'Failed to download video';
  }
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

export = {
  getEventToday,
  getAllEventsToday,
  getEventByDate,
  getAllEventsByDate,
  getVideoDetails,
  downloadVideo,
};
