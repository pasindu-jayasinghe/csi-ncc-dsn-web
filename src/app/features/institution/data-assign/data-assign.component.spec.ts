import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataAssignComponent } from './data-assign.component';

describe('DataAssignComponent', () => {
  let component: DataAssignComponent;
  let fixture: ComponentFixture<DataAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
