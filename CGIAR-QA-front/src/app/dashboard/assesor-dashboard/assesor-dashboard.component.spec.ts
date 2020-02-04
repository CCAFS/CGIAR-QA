import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssesorDashboardComponent } from './assesor-dashboard.component';

describe('AssesorDashboardComponent', () => {
  let component: AssesorDashboardComponent;
  let fixture: ComponentFixture<AssesorDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssesorDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssesorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
