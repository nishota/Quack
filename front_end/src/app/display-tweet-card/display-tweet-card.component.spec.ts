import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayTweetCardComponent } from './display-tweet-card.component';

describe('DisplayTweetCardComponent', () => {
  let component: DisplayTweetCardComponent;
  let fixture: ComponentFixture<DisplayTweetCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayTweetCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayTweetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
