import { Injectable } from '@angular/core';
import { TweetData } from '../model/tweet.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisplayService {
  subject = new Subject<TweetData>();
  content$ = this.subject.asObservable();

  private tweet: TweetData;
  public get Tweet(): TweetData {
    return this.tweet;
  }
  public set Tweet(v: TweetData) {
    this.tweet = v;
    this.subject.next(v);
  }

  constructor() {
  }

}
