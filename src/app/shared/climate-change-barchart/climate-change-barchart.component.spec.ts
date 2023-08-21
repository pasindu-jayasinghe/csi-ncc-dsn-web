import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClimateChangeBarchartComponent } from './climate-change-barchart.component';

describe('ClimateChangeBarchartComponent', () => {
  let component: ClimateChangeBarchartComponent;
  let fixture: ComponentFixture<ClimateChangeBarchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClimateChangeBarchartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClimateChangeBarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
