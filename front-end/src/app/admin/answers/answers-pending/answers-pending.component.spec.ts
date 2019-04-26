import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswersPendingComponent } from './answers-pending.component';

describe('AnswersPendingComponent', () => {
  let component: AnswersPendingComponent;
  let fixture: ComponentFixture<AnswersPendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswersPendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswersPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
