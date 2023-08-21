import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterLocationListComponent } from './parameter-location-list.component';

describe('ParameterLocationListComponent', () => {
  let component: ParameterLocationListComponent;
  let fixture: ComponentFixture<ParameterLocationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterLocationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterLocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
