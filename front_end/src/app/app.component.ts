import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Description } from './model/description.model';
import { WindowStateService } from './window-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private meta: Meta, private ws: WindowStateService) {
  }

  ngOnInit(): void {

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
    const ua = navigator.userAgent;
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
      this.router.navigate(['/mobile']);
    } else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
      this.router.navigate(['/desktop']);
    } else {
      this.router.navigate(['/desktop']);
    }
  }
}
