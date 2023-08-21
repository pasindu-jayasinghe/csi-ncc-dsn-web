import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataRequestHistoryComponent } from './data-request-history.component';

describe('DataRequestHistoryComponent', () => {
  let component: DataRequestHistoryComponent;
  let fixture: ComponentFixture<DataRequestHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataRequestHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRequestHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
