import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectProgramDataRequestApproveComponent } from './project-program-data-request-approve.component';

describe('ProjectProgramDataRequestApproveComponent', () => {
  let component: ProjectProgramDataRequestApproveComponent;
  let fixture: ComponentFixture<ProjectProgramDataRequestApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectProgramDataRequestApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectProgramDataRequestApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
