export class Tweet {
    private tweetId: string;
    private user: string;
    private date: string;
    private text: string;

    // コンストラクタでのみ値を設定する
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
}

export interface TweetRes {
    trend: string;
    maxid: string;
    tweets: any[];
}
