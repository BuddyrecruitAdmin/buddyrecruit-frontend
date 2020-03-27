import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExanOnlineDetailComponent } from './exan-online-detail.component';

describe('ExanOnlineDetailComponent', () => {
  let component: ExanOnlineDetailComponent;
  let fixture: ComponentFixture<ExanOnlineDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExanOnlineDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExanOnlineDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
