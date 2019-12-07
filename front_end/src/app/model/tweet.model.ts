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
    FromTop: number;
    isShown: boolean;
    Changed: boolean;
    Delay: number;
    constructor(
        id: number, text: string, user: string,
        url: string, date: string, fromTop: number,
        isShown: boolean, changed: boolean, delay: number) {
        this.id = id;
        this.Text = text;
        this.User = user;
        this.Url = url;
        this.Date = date;
        this.FromTop = fromTop;
        this.isShown = isShown;
        this.Changed = changed;
        this.Delay = delay;
    }
}
