/// <reference lib="webworker" />

import { Tweet } from '../model/tweet.model';
import { DateTime } from '../util/datetime.util';

addEventListener('message', ({ data }) => {
  const tweet = new Tweet(
    data.id_str,
    data.screen_name,
    DateTime.setDateString(data.created_at),
    data.text);
  postMessage(tweet);
});
