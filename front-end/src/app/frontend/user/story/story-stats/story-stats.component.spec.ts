import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryStatsComponent } from './story-stats.component';

describe('StoryStatsComponent', () => {
  let component: StoryStatsComponent;
  let fixture: ComponentFixture<StoryStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
