import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterDataPurchaseComponent } from './parameter-data-purchase.component';

describe('ParameterDataPurchaseComponent', () => {
  let component: ParameterDataPurchaseComponent;
  let fixture: ComponentFixture<ParameterDataPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterDataPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterDataPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
