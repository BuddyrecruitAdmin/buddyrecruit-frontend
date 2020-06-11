import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationFormStatusComponent } from './application-form-status.component';

describe('ApplicationFormStatusComponent', () => {
  let component: ApplicationFormStatusComponent;
  let fixture: ComponentFixture<ApplicationFormStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationFormStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationFormStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
