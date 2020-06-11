import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationFormIndexComponent } from './application-form-index.component';

describe('ApplicationFormIndexComponent', () => {
  let component: ApplicationFormIndexComponent;
  let fixture: ComponentFixture<ApplicationFormIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationFormIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationFormIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
