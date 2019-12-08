import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcTrendComponent } from './pc-trend.component';

describe('PcTrendComponent', () => {
  let component: PcTrendComponent;
  let fixture: ComponentFixture<PcTrendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcTrendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
