/**
 * 取得データ型
 */
export interface TweetRes {
    trend: string;
    tweets: any[];
}

export class TweetData {
    id: number;
    Text: string;
    User: string;
    Url: string;
    Date: string;
    isShown: boolean;
    constructor(id: number, text: string, user: string, url: string, date: string, isShown: boolean) {
        this.id = id;
        this.Text = text;
        this.User = user;
        this.Url = url;
        this.Date = date;
        this.isShown = isShown;
    }
}
