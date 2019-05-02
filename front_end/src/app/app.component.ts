import { Component, OnInit, OnDestroy } from '@angular/core';
import * as anime from 'animejs';
import { Subject, Subscription } from 'rxjs';
import { Title } from "./title.model";
import { NewsService } from './news.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  titlesSaved: Title[] = [];
  titles: Title[] = [];
  newsTitle: { article: string, id: number }[] = [];

  count = 0;
  titleCN = 'title';

  private subject = new Subject<void>();
  public content$ = this.subject.asObservable();
  subscription: Subscription;

  completed: boolean = true;

  timeLeft: number = 120;
  interval: any;

  constructor(private ns: NewsService) {
  }

  ngOnInit(): void {
    this.subscription = this.content$.subscribe(
      () => {
        console.log('flag is changed!');
        if (this.titles.length > this.count) {
          this.titles.push(this.titlesSaved[this.count])
          this.moveDom();
        }
      }
    );
    this.getNews();
    this.startTimer();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * ニュース情報を取得する
   */
  getNews(): void {
    this.ns.getNews()
      .subscribe(newsJson => {
        this.newsTitle = newsJson['articles'];
        let domNumber = 0;
        this.newsTitle.forEach(
          news => {
            const newTitle: Title = new Title(
              news.article,
              this.titleCN + String(domNumber)
            );
            this.titlesSaved.push(newTitle);
            domNumber++;
          }
        );
      })
  }

  /**
   * 表示イベント
   */
  onClick() {
    if (this.completed) {
      this.completed = false;
      const title = this.titlesSaved[this.count];
      if (title) {
        this.titles.push(title);
        this.count++;
      }
      this.moveDom();
    } else {
      this.completed = true;
    }
  }

  /**
   * 名前を指定したDOMを指定された座標へ動かす。
   * 座標は、coordBefore,coordを参照する。
   */
  moveDom() {
    if (this.titles.length > 0) {
      this.titles.forEach(title => title.setCoordRandom());

      this.titles.forEach(t => {
        //t => t.setCoordRandom()
        anime({
          targets: '.' + t.className,
          translateX: [t.coordBefore.x, t.coord.x],
          translateY: [t.coordBefore.y, t.coord.y],
          easing: 'easeOutCubic',
          complete: () => {
            console.log('animation is completed!', this.count);
            this.subject.next();
            this.completed = true;
          }
        });
      });
    }
  }
  /**
   * タイマー設定。
   * interval秒onClickを繰り返す
   */
  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.onClick();
      }
    }, 1500);
  }
}

