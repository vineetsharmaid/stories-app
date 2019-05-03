import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswersPublishedComponent } from './answers-published.component';

describe('AnswersPublishedComponent', () => {
  let component: AnswersPublishedComponent;
  let fixture: ComponentFixture<AnswersPublishedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswersPublishedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswersPublishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
