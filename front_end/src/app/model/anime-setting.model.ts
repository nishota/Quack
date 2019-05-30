import { environment } from 'src/environments/environment';
import { TweetData } from './tweet.model';
import { Card } from './card.model';

export enum AnimeMode {
    random,
    straight
}

export class AnimeSetting {
    card: Card;
    tweet: TweetData;
    id = 'target';
    className = 'center target';
    userPage = environment.twitterURL;
    zIndex: number;
    time: number;

    constructor(card: Card, tweet: TweetData, time: number) {
        this.card = card;
        this.tweet = tweet;
        const tweetNum = this.tweet.TweetId.slice(-3);
        this.id += tweetNum;
        this.className += tweetNum;
        this.userPage += this.tweet.User;
        const id = Number(tweetNum);
        if (Number.isInteger(id)) {
            this.zIndex = id;
        }
        this.time = time;
    }

    set(mode: AnimeMode) {
        let setting;
        switch (mode) {
            case AnimeMode.random:
                // this.TIME = 3000; 推奨される時間
                this.card.setCoordRandom();
                this.card.setScaleAndOpacityRandom();
                setting = {
                    targets: '.' + this.id,
                    translateX: [this.card.coordBefore.x, this.card.coord.x],
                    translateY: [this.card.coordBefore.y, this.card.coord.y],
                    scale: this.card.scale,
                    opacity: this.card.opacity,
                    easing: 'easeOutCubic'
                };
                break;
            case AnimeMode.straight:
            default:
                // this.TIME = 10000; 推奨される時間
                this.card.setCoordLikeNico();
                this.card.scale = 1;
                this.card.opacity = 0.75;
                setting = {
                    targets: '.' + this.id,
                    translateX: [this.card.coordBefore.x, this.card.coord.x],
                    translateY: [this.card.coordBefore.y, this.card.coord.y],
                    scale: this.card.scale,
                    opacity: this.card.opacity,
                    easing: 'linear',
                    duration: this.time,
                    delay: Math.random() * (this.time / 2)
                };
                break;
        }
        return setting;
    }
}
