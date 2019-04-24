import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryNewComponent } from './story-new.component';

describe('StoryNewComponent', () => {
  let component: StoryNewComponent;
  let fixture: ComponentFixture<StoryNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
