import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyDataAssignComponent } from './policy-data-assign.component';

describe('PolicyDataAssignComponent', () => {
  let component: PolicyDataAssignComponent;
  let fixture: ComponentFixture<PolicyDataAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyDataAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyDataAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
