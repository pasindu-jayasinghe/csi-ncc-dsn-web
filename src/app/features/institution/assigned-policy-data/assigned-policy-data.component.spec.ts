import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedPolicyDataComponent } from './assigned-policy-data.component';

describe('AssignedPolicyDataComponent', () => {
  let component: AssignedPolicyDataComponent;
  let fixture: ComponentFixture<AssignedPolicyDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignedPolicyDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedPolicyDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
