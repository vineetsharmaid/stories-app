import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoriesPendingComponent } from './stories-pending.component';

describe('StoriesPendingComponent', () => {
  let component: StoriesPendingComponent;
  let fixture: ComponentFixture<StoriesPendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoriesPendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoriesPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
