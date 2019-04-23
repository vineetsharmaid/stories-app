import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsEditComponent } from './topics-edit.component';

describe('TopicsEditComponent', () => {
  let component: TopicsEditComponent;
  let fixture: ComponentFixture<TopicsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
