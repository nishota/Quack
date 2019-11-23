import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TealComponent } from './teal.component';

describe('TealComponent', () => {
  let component: TealComponent;
  let fixture: ComponentFixture<TealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TealComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
