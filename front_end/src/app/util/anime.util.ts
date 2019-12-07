import { TweetData } from '../model/tweet.model';

export class Anime {
    /**
     * それぞれのカードのアニメーションを設定する
     * @param data カードのデータ
     * @param isLoading ローディング中かどうか
     * @param callback animetion終了時の処理
     */
    static startAnime(
        data: TweetData,
        isLoading: boolean,
        duration: number,
        delay: number,
        callback: (data: TweetData) => void) {
            if (!isLoading) {
                data.isShown = true;
            }
            setTimeout(() => {
                callback(data);
            }, 1000 * (duration + delay));
        }
}
