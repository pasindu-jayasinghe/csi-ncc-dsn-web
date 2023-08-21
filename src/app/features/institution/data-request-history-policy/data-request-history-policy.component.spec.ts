import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataRequestHistoryPolicyComponent } from './data-request-history-policy.component';

describe('DataRequestHistoryPolicyComponent', () => {
  let component: DataRequestHistoryPolicyComponent;
  let fixture: ComponentFixture<DataRequestHistoryPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataRequestHistoryPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRequestHistoryPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
