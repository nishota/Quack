import { environment } from '../../environments/environment';
/**
 * ツイートクラス
 */
export class Tweet {
    private tweetId: string;
    private user: string;
    private date: string;
    private text: string;

    constructor(
        tweetId: string, user: string,
        date: string, text: string) {
        this.tweetId = tweetId;
        this.user = user;
        this.date = date;
        this.text = text;
    }

    get TweetId(): string {
        return this.tweetId;
    }

    get User(): string {
        return this.user;
    }

    get Date(): string {
        return this.date;
    }
    get Text(): string {
        return this.text;
    }
    get Url(): string {
        return environment.twitterUrl + this.User;
    }
}

/**
 * 取得データ型
 */
export interface TweetRes {
    trend: string;
    maxid: string;
    tweets: any[];
}

/**
 * 表示用データクラス
 */
export class TweetData {
    id: number;
    tweet: Tweet;
    isShown: boolean;
    constructor(id: number, tweet: Tweet) {
        this.id = id;
        this.tweet = tweet;
        this.isShown = false;
    }
}
