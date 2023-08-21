import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFundingDetailsComponent } from './project-funding-details.component';

describe('ProjectFundingDetailsComponent', () => {
  let component: ProjectFundingDetailsComponent;
  let fixture: ComponentFixture<ProjectFundingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectFundingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectFundingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
