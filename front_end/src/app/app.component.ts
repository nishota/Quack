import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Description } from './model/description.model';
import { environment } from 'src/environments/environment';
import { WindowStateService } from './window-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  subscription: Subscription;

  constructor(private meta: Meta, private ws: WindowStateService) {
  }

  ngOnInit(): void {
    // デバッグモードでは、リサイズしたら、リロードしない
    if (environment.production) {
      this.subscription = this.ws.windowResize$.subscribe(
        () => window.location.reload()
      );
    }
    this.ws.meta$.subscribe(
      (res: Description) => {
        this.meta.addTag({
          name: 'discription',
          content: res.description
        });
        // this.meta.addTag({
        //   property: 'twitter:card',
        //   content: res.twitterCard
        // });
        // this.meta.addTag({
        //   property: 'twitter:site',
        //   content: res.twitterSite
        // });
        // this.meta.addTag({
        //   property: 'og:url',
        //   content: res.ogUrl
        // });
        // this.meta.addTag({
        //   property: 'og:title',
        //   content: res.ogTitle
        // });
        // this.meta.addTag({
        //   property: 'og:description',
        //   content: res.ogDescription
        // });
        // this.meta.addTag({
        //   property: 'og:image',
        //   content: environment.frontUrl + res.ogImage
        // });
        // this.meta.addTag({
        //   property: 'og:type',
        //   content: res.ogType
        // });
      });
  }
}
