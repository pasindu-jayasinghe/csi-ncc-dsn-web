import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyDataRequestComponent } from './policy-data-request.component';

describe('PolicyDataRequestComponent', () => {
  let component: PolicyDataRequestComponent;
  let fixture: ComponentFixture<PolicyDataRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyDataRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyDataRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
