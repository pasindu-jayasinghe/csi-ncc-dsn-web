import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyViewInfoComponent } from './policy-view-info.component';

describe('PolicyViewInfoComponent', () => {
  let component: PolicyViewInfoComponent;
  let fixture: ComponentFixture<PolicyViewInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyViewInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyViewInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
