import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusHistoryPopComponent } from './status-history-pop.component';

describe('StatusHistoryPopComponent', () => {
  let component: StatusHistoryPopComponent;
  let fixture: ComponentFixture<StatusHistoryPopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusHistoryPopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusHistoryPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
