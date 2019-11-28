/// <reference lib="webworker" />

import { TweetData2 } from '../model/tweet.model';
import { DateTime } from '../util/datetime.util';
import { Count } from 'src/environments/const.environment';
import { environment } from 'src/environments/environment';


let count = 0;
addEventListener('message', ({ data }) => {
  const tweetDatas: TweetData2[] = [];
  data.forEach(
    (tweet) => {
      const tweetData = new TweetData2(
        count % Count.Card,
        tweet.text,
        tweet.screen_name,
        environment.twitterUrl + tweet.screen_name,
        DateTime.setDateString(tweet.created_at),
        false
      );
      tweetDatas.push(tweetData);
      count++;
    });
  postMessage(tweetDatas);
});
