import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectProgramDataRequestComponent } from './project-program-data-request.component';

describe('ProjectProgramDataRequestComponent', () => {
  let component: ProjectProgramDataRequestComponent;
  let fixture: ComponentFixture<ProjectProgramDataRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectProgramDataRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectProgramDataRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
