import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GeneralDetailedIndicatorComponent } from './general-detailed-indicator.component';

describe('GeneralDetailedIndicatorComponent', () => {
  let component: GeneralDetailedIndicatorComponent;
  let fixture: ComponentFixture<GeneralDetailedIndicatorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralDetailedIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralDetailedIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
