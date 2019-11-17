import { TweetData } from '../model/tweet.model';
import anime from 'animejs/lib/anime.es.js';

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
        callback: (data: TweetData) => void) {
            if (!isLoading) {
                data.isShown = true;
            }
            const targetId = '#target' + String(data.id);
            anime({
                targets: targetId,
                translateX: [0, -(window.innerWidth + 332)],
                easing: 'linear',
                duration: 15 * window.innerWidth,
                delay: Math.random() * 1000,
                complete: () => callback(data)
            });
    }
}
