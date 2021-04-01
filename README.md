# Arkib

**Unofficial** client API for National Archives of Malaysia (Arkib Negara)

## Features

☑️ **Promise-based**

## Getting Started

### Install using npm

```
npm install arkib
```

## Usage

### Using promise

```
const arkib = require('arkib')

arkib.getEventToday()
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

### Using async/await

```
const arkib = require('arkib')

(async => {
  try {
    const historyToday = await arkib.getEventToday();
    console.log(historyToday);
  } catch (err) {
    console.error(err);
  }
})();
```

### Example response

```
{
  id: 4196,
  title_bm: 'PEMINDAHAN KUASA NEGERI-NEGERI SELAT DARI INDIA KE PEJABAT TANAH JAJAHAN DI LONDON',
  title_eng: 'TRANSFER OF AUTHORITY OF THE STRAITS SETTLEMENT FROM INDIA TO THE COLONIAL OFFICE IN LONDON',
  description_bm: 'Pada hari ini dalam tahun 1867, Pejabat Tanah Jajahan London...',
  description_eng: 'On this day in 1867, the London Colonial Office...',
  script_date: '01/04/1867',
  lkp_era_id: null,
  lkp_sub_era_id: null,
  lkp_source_id: null,
  upload_date: null,
  display_date: '1867-04-01',
  lkp_process_status_id: 4,
  lkp_status_id: null,
  version: '1.0',
  created_at: '2019-09-06 07:01:55',
  updated_at: '2019-09-06 07:02:15',
  deleted_at: null,
  rate: null,
  day: 'Isnin',
  script_day: '1',
  script_month: '4'
}
```

## Available methods

### `getEventToday()`
#### Descriptions
This method will return **Javascript object** of one today's historical moment. It based on your server's timezone.
**Return: Javascript Object**

**Note:** Sometimes, there is no english version of title and description.

##### Example Response:
```
{
  id: 4196,
  title_bm: 'PEMINDAHAN KUASA NEGERI-NEGERI SELAT DARI INDIA KE PEJABAT TANAH JAJAHAN DI LONDON',
  title_eng: 'TRANSFER OF AUTHORITY OF THE STRAITS SETTLEMENT FROM INDIA TO THE COLONIAL OFFICE IN LONDON',
  description_bm: 'Pada hari ini dalam tahun 1867, Pejabat Tanah Jajahan London...',
  description_eng: 'On this day in 1867, the London Colonial Office...',
  script_date: '01/04/1867',
  lkp_era_id: null,
  lkp_sub_era_id: null,
  lkp_source_id: null,
  upload_date: null,
  display_date: '1867-04-01',
  lkp_process_status_id: 4,
  lkp_status_id: null,
  version: '1.0',
  created_at: '2019-09-06 07:01:55',
  updated_at: '2019-09-06 07:02:15',
  deleted_at: null,
  rate: null,
  day: 'Isnin',
  script_day: '1',
  script_month: '4'
}
```

### `getAllEventsToday()`
#### Description
This method will return an **array of Javascript object** of all today's historical moment. It based on your server's timezone.
**Return: Array of Javascript Object**

**Note:** Sometimes, there is no english version of title and description.

##### Example Response

```
[
  {
    no: 0,
    day: 'Isnin',
    script_date: '01/04/1867',
    description_bm: 'Pada hari ini dalam tahun 1867...',        
    id: 4196,
    title_bm: 'PEMINDAHAN KUASA NEGERI-NEGERI SELAT DARI INDIA KE PEJABAT TANAH JAJAHAN DI LONDON',
    title_eng: 'TRANSFER OF AUTHORITY OF THE STRAITS SETTLEMENT FROM INDIA TO THE COLONIAL OFFICE IN LONDON',
    lkp_era_id: null,
    lkp_sub_era_id: null,
    lkp_source_id: null,
    upload_date: null,
    display_date: '1867-04-01',
    lkp_process_status_id: 4,
    lkp_status_id: null,
    version: '1.0',
    created_at: '2019-09-06 07:01:55',
    updated_at: '2019-09-06 07:02:15',
    deleted_at: null,
    rate: null
  },
  {
    no: 1,
    day: 'Isnin',
    script_date: '01/04/1929',
    description_bm: 'Pada hari ini dalam tahun 1929...',
    description_eng: 'On this day in 1929...',
    id: 2337,
    title_bm: 'SEKOLAH PERGURUAN KOTA BAHARU DIBUKA',
    title_eng: 'KOTA BAHARU TEACHERS TRAINING SCHOOL OPENED',
    lkp_era_id: null,
    lkp_sub_era_id: null,
    lkp_source_id: null,
    upload_date: null,
    display_date: '1929-04-01',
    lkp_process_status_id: 4,
    lkp_status_id: null,
    version: '1.0',
    created_at: '2019-09-06 07:01:34',
    updated_at: '2019-09-06 07:01:34',
    deleted_at: null,
    rate: null
  }
]
```

## License

This project is licensed under the [MIT License](https://github.com/ADIBzTER/arkib/blob/master/LICENSE)