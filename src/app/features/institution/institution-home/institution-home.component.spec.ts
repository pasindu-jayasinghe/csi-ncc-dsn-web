import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionHomeComponent } from './institution-home.component';

describe('InstitutionHomeComponent', () => {
  let component: InstitutionHomeComponent;
  let fixture: ComponentFixture<InstitutionHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstitutionHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
