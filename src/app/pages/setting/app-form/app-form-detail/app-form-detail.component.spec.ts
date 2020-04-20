import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFormDetailComponent } from './app-form-detail.component';

describe('AppFormDetailComponent', () => {
  let component: AppFormDetailComponent;
  let fixture: ComponentFixture<AppFormDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppFormDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFormDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
