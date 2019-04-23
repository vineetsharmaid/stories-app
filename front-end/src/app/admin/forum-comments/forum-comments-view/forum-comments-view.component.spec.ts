import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumCommentsViewComponent } from './forum-comments-view.component';

describe('ForumCommentsViewComponent', () => {
  let component: ForumCommentsViewComponent;
  let fixture: ComponentFixture<ForumCommentsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumCommentsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumCommentsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
