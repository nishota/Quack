import { TweetData } from '../model/tweet.model';
import anime from 'animejs/lib/anime.es.js';

export class Anime {
    /**
     * それぞれのカードのアニメーションを設定する
     * @param data カードのデータ
     */
    static startAnime(
        data: TweetData,
        isLoading: boolean,
        indexHeight: number,
        callback: (data: TweetData) => void) {
            if (!isLoading) {
                data.isShown = true;
            }
            const newNum = Math.round(Math.random() * indexHeight);
            const targetId = '#target' + String(data.id);
            anime({
                targets: targetId,
                translateX: [0, -(window.innerWidth + 332)],
                easing: 'linear',
                duration: 15 * window.innerWidth,
                delay: newNum * 1000,
                complete: () => callback(data)
            });
    }
}
