import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailIndicatorComponent } from './detail-indicator.component';

describe('DetailIndicatorComponent', () => {
  let component: DetailIndicatorComponent;
  let fixture: ComponentFixture<DetailIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
