import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedProjectDataComponent } from './assigned-project-data.component';

describe('AssignedProjectDataComponent', () => {
  let component: AssignedProjectDataComponent;
  let fixture: ComponentFixture<AssignedProjectDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignedProjectDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedProjectDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
