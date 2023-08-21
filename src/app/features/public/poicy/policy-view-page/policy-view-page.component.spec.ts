import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyViewPageComponent } from './policy-view-page.component';

describe('PolicyViewPageComponent', () => {
  let component: PolicyViewPageComponent;
  let fixture: ComponentFixture<PolicyViewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyViewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
