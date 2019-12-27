import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpTrendListComponent } from './sp-trend-list.component';

describe('SpTrendListComponent', () => {
  let component: SpTrendListComponent;
  let fixture: ComponentFixture<SpTrendListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpTrendListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpTrendListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
