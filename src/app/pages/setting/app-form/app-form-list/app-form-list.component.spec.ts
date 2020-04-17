import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFormListComponent } from './app-form-list.component';

describe('AppFormListComponent', () => {
  let component: AppFormListComponent;
  let fixture: ComponentFixture<AppFormListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppFormListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
