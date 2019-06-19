export class Tweet {
    private tweetId: string;
    private user: string;
    private date: Date;
    private text: string;
    id: number;

    // コンストラクタでのみ値を設定する
    constructor(
        tweetId: string, user: string,
        date: Date, text: string, id: number) {
        this.tweetId = tweetId;
        this.user = user;
        this.date = date;
        this.text = text;
        this.id = id;
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
