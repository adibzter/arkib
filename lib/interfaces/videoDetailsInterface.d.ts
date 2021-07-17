export interface VideoDetailsInterface {
    id: number;
    url: string;
    title_bm: string;
    title_eng: string;
    description_bm: string;
    description_eng: string;
    lkp_era: {
        id: number;
        thumbnail: string;
        title_bm: string;
        title_eng: string;
        start_date: string;
        end_date: string;
    };
    lkp_video_theme: {
        id: number;
        title_bm: string;
        title_eng: string;
    };
    lkp_video_treatment: {
        id: number;
        title_bm: string;
        title_eng: string;
    };
}
export interface DownloadVideo {
    savePath?: string;
    fileName?: string;
}
