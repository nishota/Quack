import { environment } from '../../environments/environment';

export class Tweet2 {
    User: string;
    Date: string;
    Text: string;
    Url: string;
    constructor(date: string, user: string, text: string) {
        this.Date = date;
        this.User = user;
        this.Text = text;
        this.Url = environment.twitterUrl + this.User;
    }
}

/**
 * 取得データ型
 */
export interface TweetRes {
    trend: string;
    tweets: any[];
}

export class TweetData2 {
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
