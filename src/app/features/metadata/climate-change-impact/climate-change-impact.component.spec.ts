import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClimateChangeImpactComponent } from './climate-change-impact.component';

describe('ClimateChangeImpactComponent', () => {
  let component: ClimateChangeImpactComponent;
  let fixture: ComponentFixture<ClimateChangeImpactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClimateChangeImpactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClimateChangeImpactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
