import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsAddComponent } from './topics-add.component';

describe('TopicsAddComponent', () => {
  let component: TopicsAddComponent;
  let fixture: ComponentFixture<TopicsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
