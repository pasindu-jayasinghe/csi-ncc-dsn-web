import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyDataEntryComponent } from './policy-data-entry.component';

describe('PolicyDataEntryComponent', () => {
  let component: PolicyDataEntryComponent;
  let fixture: ComponentFixture<PolicyDataEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyDataEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
