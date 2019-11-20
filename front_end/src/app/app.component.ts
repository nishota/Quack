import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Description } from './model/description.model';
import { InfomationService } from './infomation.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private meta: Meta, private is: InfomationService) {
  }

  ngOnInit(): void {
    this.is.getDescription().subscribe(
      (res: Description) => {
        this.meta.addTag({
            name: 'discription',
            content: res.description
        });
        this.meta.addTag({
          property: 'twitter:card',
          content: res.twitterCard
        });
        this.meta.addTag({
          property: 'twitter:site',
          content: res.twitterSite
        });
        this.meta.addTag({
          property: 'og:url',
          content: res.ogUrl
        });
        this.meta.addTag({
          property: 'og:title',
          content: res.ogTitle
        });
        this.meta.addTag({
          property: 'og:description',
          content: res.ogDescription
        });
        this.meta.addTag({
          property: 'og:image',
          content: environment.frontUrl + res.ogImage
        });
        this.meta.addTag({
          property: 'og:type',
          content: res.ogType
        });
      });
  }
}
