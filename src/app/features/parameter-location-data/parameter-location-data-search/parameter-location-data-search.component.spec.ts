import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterLocationDataSearchComponent } from './parameter-location-data-search.component';

describe('ParameterLocationDataSearchComponent', () => {
  let component: ParameterLocationDataSearchComponent;
  let fixture: ComponentFixture<ParameterLocationDataSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterLocationDataSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterLocationDataSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
