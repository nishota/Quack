import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpLogoComponent } from './sp-logo.component';

describe('SpLogoComponent', () => {
  let component: SpLogoComponent;
  let fixture: ComponentFixture<SpLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
