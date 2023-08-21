import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyDataRequestApproveComponent } from './policy-data-request-approve.component';

describe('PolicyDataRequestApproveComponent', () => {
  let component: PolicyDataRequestApproveComponent;
  let fixture: ComponentFixture<PolicyDataRequestApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyDataRequestApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyDataRequestApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
