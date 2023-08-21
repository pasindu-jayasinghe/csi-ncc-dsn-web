import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UomConversionComponent } from './uom-conversion.component';

describe('UomConversionComponent', () => {
  let component: UomConversionComponent;
  let fixture: ComponentFixture<UomConversionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UomConversionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UomConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
