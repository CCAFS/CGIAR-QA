import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssessorsChatComponent } from './assessors-chat.component';

describe('AssessorsChatComponent', () => {
  let component: AssessorsChatComponent;
  let fixture: ComponentFixture<AssessorsChatComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessorsChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessorsChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
