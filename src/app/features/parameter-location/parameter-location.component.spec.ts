import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterLocationComponent } from './parameter-location.component';

describe('ParameterLocationComponent', () => {
  let component: ParameterLocationComponent;
  let fixture: ComponentFixture<ParameterLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
