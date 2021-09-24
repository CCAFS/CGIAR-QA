import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QaCloseComponent } from './qa-close.component';

describe('QaCloseComponent', () => {
  let component: QaCloseComponent;
  let fixture: ComponentFixture<QaCloseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QaCloseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QaCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
