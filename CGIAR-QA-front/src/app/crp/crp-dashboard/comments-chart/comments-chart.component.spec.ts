import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommentsChartComponent } from './comments-chart.component';

describe('CommentsChartComponent', () => {
  let component: CommentsChartComponent;
  let fixture: ComponentFixture<CommentsChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentsChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
