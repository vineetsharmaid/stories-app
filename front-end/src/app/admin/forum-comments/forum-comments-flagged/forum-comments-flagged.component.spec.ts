import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumCommentsFlaggedComponent } from './forum-comments-flagged.component';

describe('ForumCommentsFlaggedComponent', () => {
  let component: ForumCommentsFlaggedComponent;
  let fixture: ComponentFixture<ForumCommentsFlaggedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumCommentsFlaggedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumCommentsFlaggedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
