import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcDataCategoryComponent } from './cc-data-category.component';

describe('CcDataCategoryComponent', () => {
  let component: CcDataCategoryComponent;
  let fixture: ComponentFixture<CcDataCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcDataCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcDataCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
