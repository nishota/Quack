import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Tweet } from './model/tweet.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TweetGeneratorService {
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
            const timeZoneOffset = new Date().getTimezoneOffset() / 60;
            const createdTime = new Date(tweet.created_at);
            createdTime.setHours(createdTime.getHours() - timeZoneOffset);

            this.trendSource.next(tweet.trend);
            this.contentSource.next(
              new Tweet(
                tweet.id_str,
                tweet.screen_name,
                createdTime,
                tweet.text
              ));
          }
        );
      }
    );
  }

  getTweetFromServer(): Observable<any[]> {
    return this.http.get<any[]>(environment.devUrl);
  }
}
