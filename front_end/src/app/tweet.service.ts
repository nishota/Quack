import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { PARAMETERS } from '@angular/core/src/util/decorators';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TweetService {
  private tweetWithAcountUrl = 'https://payload-01.herokuapp.com/json/twitter/account'
  private tweetWithKeywordUrl = 'https://payload-01.herokuapp.com/json/twitter/keyword'

  constructor(private http: HttpClient) { }

  getTweetWithAccount(account: string): Observable<any[]> {
    const options = account ? { params: new HttpParams().set('account', account) } : {}
    return this.http.get<any[]>(this.tweetWithAcountUrl, options)
  }

  getTweetWithKeyword(keyword: string): Observable<any[]> {
    const options = keyword ? { params: new HttpParams().set('keyword', keyword) } : {}
    return this.http.get<any[]>(this.tweetWithKeywordUrl, options)
  }

  getAllTweet(): Observable<any[]> {
    return this.http.get<any[]>(environment.url.tweettext);
  }
}
