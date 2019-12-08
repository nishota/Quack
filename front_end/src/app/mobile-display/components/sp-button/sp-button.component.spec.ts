import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpButtonComponent } from './sp-button.component';

describe('SpButtonComponent', () => {
  let component: SpButtonComponent;
  let fixture: ComponentFixture<SpButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
