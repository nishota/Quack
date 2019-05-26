import { Injectable } from '@angular/core';
import { TweetData } from '../model/tweet.model';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TwitterService {

  constructor(private http: HttpClient) { }

  getTweetFomDevServer(): Observable<any[]> {
    return this.http.get<any[]>(environment.devUrl);
  }

  getTweetWithAccount(account?: string): Observable<any[]> {
    const options = account ? { params: new HttpParams().set('account', account) } : {};
    return this.http.get<any[]>(environment.tweetWithAcountUrl, options);
  }

  getTweetWithKeyword(keyword?: string): Observable<any[]> {
    const options = keyword ? { params: new HttpParams().set('keyword', keyword) } : {};
    return this.http.get<any[]>(environment.tweetWithKeywordUrl, options);
  }

  getTweetData(): Observable<TweetData[]> {
    return of([
      new TweetData('1124670810151477248', 'samari2038', new Date(), 'テストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテスト'),
      new TweetData('1124670810151477349', 'samari2038', new Date(), 'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttest'),
      new TweetData('1124670810151477450', 'samari2038', new Date(), 'hogehoge'),
      new TweetData('1124670810151477551', 'samari2038', new Date(), 'hugahuga'),
      new TweetData('1124670810151477552', 'samari2038', new Date(), 'hugehuge'),
      new TweetData('1124670810151477553', 'samari2038', new Date(), 'hogahoga'),
      new TweetData('1124670810151477254', 'samari2038', new Date(), 'テストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテスト'),
      new TweetData('1124670810151477355', 'samari2038', new Date(), 'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttest'),
      new TweetData('1124670810151477456', 'samari2038', new Date(), 'hogehoge'),
      new TweetData('1124670810151477557', 'samari2038', new Date(), 'hugahuga'),
      new TweetData('1124670810151477558', 'samari2038', new Date(), 'hugehuge'),
      new TweetData('1124670810151477559', 'samari2038', new Date(), 'hogahoga'),
      new TweetData('1124670810151477260', 'samari2038', new Date(), 'テストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテスト'),
      new TweetData('1124670810151477361', 'samari2038', new Date(), 'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttest'),
      new TweetData('1124670810151477462', 'samari2038', new Date(), 'hogehoge'),
      new TweetData('1124670810151477563', 'samari2038', new Date(), 'hugahuga'),
      new TweetData('1124670810151477564', 'samari2038', new Date(), 'hugehuge'),
      new TweetData('1124670810151477565', 'samari2038', new Date(), 'hogahoga')
    ]);
  }
}
