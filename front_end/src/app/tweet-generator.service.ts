import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Tweet } from './model/tweet.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TweetGeneratorService {
  count = 0;
  seqCount = 0;
  maxId = '';

  trendSource = new Subject<string>();
  trend$ = this.trendSource.asObservable();

  contentSource = new Subject<Tweet>();
  content$ = this.contentSource.asObservable();

  dismissSource = new Subject<Tweet>();
  dismiss$ = this.dismissSource.asObservable();

  constructor(private http: HttpClient) {
  }

  getTweetData(): void {
    this.getTweetFromServer(this.maxId).subscribe(
      (res: any) => {
        this.trendSource.next(res.trend);
        this.maxId = res.maxid;
        console.log(this.maxId);
        if (res.tweets && res.tweets.length > 0) {
          res.tweets.forEach(
            tweet => {
              const day = moment(tweet.created_at);
              const createdTime = new Date(day.utc().format());
              this.contentSource.next(
                new Tweet(
                  tweet.id_str,
                  tweet.screen_name,
                  createdTime,
                  tweet.text,
                  this.count
                ));
              this.count++;
            }
          );
        }


        this.seqCount++;
      }
    );
  }

  getTweetFromServer(maxId: string): Observable<any> {
    const options = maxId ? { params: new HttpParams().set('maxid', maxId) } : {};
    return this.http.get<any[]>(environment.devUrl, options);
  }
}
