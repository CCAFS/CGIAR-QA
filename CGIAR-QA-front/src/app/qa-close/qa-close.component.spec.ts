import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QaCloseComponent } from './qa-close.component';

describe('QaCloseComponent', () => {
  let component: QaCloseComponent;
  let fixture: ComponentFixture<QaCloseComponent>;

  beforeEach(async(() => {
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
