import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswersFlaggedComponent } from './answers-flagged.component';

describe('AnswersFlaggedComponent', () => {
  let component: AnswersFlaggedComponent;
  let fixture: ComponentFixture<AnswersFlaggedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswersFlaggedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswersFlaggedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
