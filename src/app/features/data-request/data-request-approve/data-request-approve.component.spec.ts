import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataRequestApproveComponent } from './data-request-approve.component';

describe('DataRequestApproveComponent', () => {
  let component: DataRequestApproveComponent;
  let fixture: ComponentFixture<DataRequestApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataRequestApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRequestApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
