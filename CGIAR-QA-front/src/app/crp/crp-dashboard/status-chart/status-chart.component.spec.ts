import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StatusChartComponent } from './status-chart.component';

describe('StatusChartComponent', () => {
  let component: StatusChartComponent;
  let fixture: ComponentFixture<StatusChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
