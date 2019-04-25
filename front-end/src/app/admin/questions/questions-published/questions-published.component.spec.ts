import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsPublishedComponent } from './questions-published.component';

describe('QuestionsPublishedComponent', () => {
  let component: QuestionsPublishedComponent;
  let fixture: ComponentFixture<QuestionsPublishedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsPublishedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsPublishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
