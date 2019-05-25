export class TweetData {
    private tweetId: string;
    private user: string;
    private date: Date; // string型でもいいかも?
    private text: string;

    // コンストラクタでのみ値を設定する
    constructor(tweetId: string, user: string, date: Date, text: string) {
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
        return this.date.toLocaleString('ja-JP');
    }

    get Text(): string {
        return this.text;
    }
}