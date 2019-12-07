import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopDisplayComponent } from './desktop-display.component';

describe('DesktopDisplayComponent', () => {
  let component: DesktopDisplayComponent;
  let fixture: ComponentFixture<DesktopDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesktopDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
