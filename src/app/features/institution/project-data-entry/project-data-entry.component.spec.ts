import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDataEntryComponent } from './project-data-entry.component';

describe('ProjectDataEntryComponent', () => {
  let component: ProjectDataEntryComponent;
  let fixture: ComponentFixture<ProjectDataEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectDataEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
