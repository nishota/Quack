import { TweetData2 } from '../model/tweet.model';

export class Anime {
    /**
     * それぞれのカードのアニメーションを設定する
     * @param data カードのデータ
     * @param isLoading ローディング中かどうか
     * @param callback animetion終了時の処理
     */
    static startAnime(
        data: TweetData2,
        isLoading: boolean,
        duration: number,
        callback: (data: TweetData2) => void) {
        if (!isLoading) {
            data.isShown = true;
        }
        setTimeout(() => {
            callback(data);
        }, 1000 * duration);
    }
}
