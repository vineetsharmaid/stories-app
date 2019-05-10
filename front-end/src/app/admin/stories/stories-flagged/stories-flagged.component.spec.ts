import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoriesFlaggedComponent } from './stories-flagged.component';

describe('StoriesFlaggedComponent', () => {
  let component: StoriesFlaggedComponent;
  let fixture: ComponentFixture<StoriesFlaggedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoriesFlaggedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoriesFlaggedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
