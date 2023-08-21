import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoColumnViewComponent } from './two-column-view.component';

describe('TwoColumnViewComponent', () => {
  let component: TwoColumnViewComponent;
  let fixture: ComponentFixture<TwoColumnViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwoColumnViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoColumnViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
