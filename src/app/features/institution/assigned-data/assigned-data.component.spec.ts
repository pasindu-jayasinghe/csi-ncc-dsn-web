import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedDataComponent } from './assigned-data.component';

describe('AssignedDataComponent', () => {
  let component: AssignedDataComponent;
  let fixture: ComponentFixture<AssignedDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignedDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
