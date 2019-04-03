import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoriesPublishedComponent } from './stories-published.component';

describe('StoriesPublishedComponent', () => {
  let component: StoriesPublishedComponent;
  let fixture: ComponentFixture<StoriesPublishedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoriesPublishedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoriesPublishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
