import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataRequestHistoryProjectComponent } from './data-request-history-project.component';

describe('DataRequestHistoryProjectComponent', () => {
  let component: DataRequestHistoryProjectComponent;
  let fixture: ComponentFixture<DataRequestHistoryProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataRequestHistoryProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRequestHistoryProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
