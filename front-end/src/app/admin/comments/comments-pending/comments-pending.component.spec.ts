import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsPendingComponent } from './comments-pending.component';

describe('CommentsPendingComponent', () => {
  let component: CommentsPendingComponent;
  let fixture: ComponentFixture<CommentsPendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentsPendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
