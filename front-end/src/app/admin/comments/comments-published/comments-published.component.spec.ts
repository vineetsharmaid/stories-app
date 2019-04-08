import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsPublishedComponent } from './comments-published.component';

describe('CommentsPublishedComponent', () => {
  let component: CommentsPublishedComponent;
  let fixture: ComponentFixture<CommentsPublishedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentsPublishedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsPublishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
