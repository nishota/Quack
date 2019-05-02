import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private newsUrl = 'https://payload-01.herokuapp.com/json/news'

  constructor(private http: HttpClient) { }

  getNews(): Observable<any[]> {
    return this.http.get<any[]>(this.newsUrl)
  }
}
