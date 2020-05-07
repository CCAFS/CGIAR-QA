import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CRPIndicatorsComponent } from './indicators.component';

describe('CRPIndicatorsComponent', () => {
  let component: CRPIndicatorsComponent;
  let fixture: ComponentFixture<CRPIndicatorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CRPIndicatorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CRPIndicatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
