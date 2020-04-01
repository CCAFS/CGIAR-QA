import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrpDashboardComponent } from './crp-dashboard.component';

describe('CrpDashboardComponent', () => {
  let component: CrpDashboardComponent;
  let fixture: ComponentFixture<CrpDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrpDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrpDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
