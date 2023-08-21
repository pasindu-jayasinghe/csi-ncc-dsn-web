import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDataAssignComponent } from './project-data-assign.component';

describe('ProjectDataAssignComponent', () => {
  let component: ProjectDataAssignComponent;
  let fixture: ComponentFixture<ProjectDataAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectDataAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDataAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
