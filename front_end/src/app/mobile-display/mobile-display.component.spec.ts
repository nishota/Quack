import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileDisplayComponent } from './mobile-display.component';

describe('MobileDisplayComponent', () => {
  let component: MobileDisplayComponent;
  let fixture: ComponentFixture<MobileDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
