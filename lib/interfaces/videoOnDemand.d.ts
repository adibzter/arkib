export interface VideoOnDemand {
    id: number;
    title_bm: string;
    title_eng: string;
    description_bm: string;
    description_eng: string;
    fullVideo: {
        url: string;
    };
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
