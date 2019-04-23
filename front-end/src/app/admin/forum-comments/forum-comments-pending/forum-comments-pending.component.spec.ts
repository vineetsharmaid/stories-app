import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumCommentsPendingComponent } from './forum-comments-pending.component';

describe('ForumCommentsPendingComponent', () => {
  let component: ForumCommentsPendingComponent;
  let fixture: ComponentFixture<ForumCommentsPendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumCommentsPendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumCommentsPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
