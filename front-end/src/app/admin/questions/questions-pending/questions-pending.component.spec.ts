import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsPendingComponent } from './questions-pending.component';

describe('QuestionsPendingComponent', () => {
  let component: QuestionsPendingComponent;
  let fixture: ComponentFixture<QuestionsPendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsPendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
