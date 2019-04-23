import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumCommentsPublishedComponent } from './forum-comments-published.component';

describe('ForumCommentsPublishedComponent', () => {
  let component: ForumCommentsPublishedComponent;
  let fixture: ComponentFixture<ForumCommentsPublishedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumCommentsPublishedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumCommentsPublishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
