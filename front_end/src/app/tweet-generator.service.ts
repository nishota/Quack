import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Tweet } from './model/tweet.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TweetGeneratorService {
  count = 0;
  seqCount = 0;

  trendSource = new Subject<string>();
  trend$ = this.trendSource.asObservable();

  contentSource = new Subject<Tweet>();
  content$ = this.contentSource.asObservable();

  dismissSource = new Subject<Tweet>();
  dismiss$ = this.dismissSource.asObservable();

  constructor(private http: HttpClient) {
  }

  getTweetData(): void {
    this.getTweetFromServer().subscribe(
      (res: any[]) => {
        res.forEach(
          tweet => {
            const day = moment(tweet.created_at);
            const createdTime = new Date(day.utc().format());
            this.trendSource.next(tweet.trend);
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
        this.seqCount++;
      }
    );
  }

  getTweetFromServer(): Observable<any[]> {
    return this.http.get<any[]>(environment.devUrl);
  }
}
