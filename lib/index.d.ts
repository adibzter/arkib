import { VideoDetailsInterface, DownloadVideo } from './interfaces/VideoDetailsInterface';
import { EventTodayInterface, AllEventsTodayInterface } from './interfaces/EventTodayInterface';
declare const _default: {
    getEventToday: () => Promise<EventTodayInterface>;
    getAllEventsToday: () => Promise<AllEventsTodayInterface[]>;
    getEventByDate: (day: number, month: number) => Promise<EventTodayInterface>;
    getAllEventsByDate: (day: number, month: number) => Promise<AllEventsTodayInterface[]>;
    getVideoDetails: (id: number, language: "bm" | "eng", options?: DownloadVideo | undefined) => Promise<VideoDetailsInterface>;
    downloadVideo: (id: number, savePath?: string, fileName?: string) => Promise<string>;
};
export = _default;
