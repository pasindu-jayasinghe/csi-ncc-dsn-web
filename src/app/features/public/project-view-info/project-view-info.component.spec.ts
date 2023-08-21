import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectViewInfoComponent } from './project-view-info.component';

describe('ProjectViewInfoComponent', () => {
  let component: ProjectViewInfoComponent;
  let fixture: ComponentFixture<ProjectViewInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectViewInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectViewInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
