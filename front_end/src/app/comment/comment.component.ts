import { Component, OnInit } from '@angular/core'
import { COMMENTS } from '../mock-comments'
import { NewsService } from '../news.service'
import {TweetService} from '../tweet.service'
import * as anime from 'animejs';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  account: string
  keyword: string
  comment: any[]
  news: any[]
  tweetAccount: any[]
  tweetKeyword: any[]
  
  constructor(private newsService: NewsService, private tweetService: TweetService) { }

  getComment(): void{
    this.comment = COMMENTS
  }

  getNews(): void{
    this.newsService.getNews()
    .subscribe(newsJson => this.news = newsJson['articles'])
  }

  getTweetWithAccount(account: string): void{
    this.tweetService.getTweetWithAccount(account)
    .subscribe(tweetJsonAccount => 
      this.tweetAccount = tweetJsonAccount
    )
  }

  getTweetWithKeyword(keyword: string): void{
    this.tweetService.getTweetWithKeyword(keyword)
    .subscribe(tweetJsonKeyword =>
       this.tweetKeyword = tweetJsonKeyword
    )
  }

  ngOnInit() {
    this.getComment()
    this.getNews()
    this.getTweetWithAccount('mos_burger')
    this.getTweetWithKeyword('稲葉')
    this.initAnimation();
  }

  initAnimation(){
    anime({
      targets: 'ul',
      translateY: -250,
      delay: 500,
      // delay: function(el, index) {
      //   return index * 700;
      // },
      direction: 'reverse',
      easing: 'easeInOutSine'
    });
  }
}
