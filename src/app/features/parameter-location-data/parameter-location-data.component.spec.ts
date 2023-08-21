import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterLocationDataComponent } from './parameter-location-data.component';

describe('ParameterLocationDataComponent', () => {
  let component: ParameterLocationDataComponent;
  let fixture: ComponentFixture<ParameterLocationDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterLocationDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterLocationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
