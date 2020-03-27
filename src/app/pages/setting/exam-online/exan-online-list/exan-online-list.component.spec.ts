import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExanOnlineListComponent } from './exan-online-list.component';

describe('ExanOnlineListComponent', () => {
  let component: ExanOnlineListComponent;
  let fixture: ComponentFixture<ExanOnlineListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExanOnlineListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExanOnlineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
