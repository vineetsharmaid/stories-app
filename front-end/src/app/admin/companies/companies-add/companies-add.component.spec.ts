import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesAddComponent } from './companies-add.component';

describe('CompaniesAddComponent', () => {
  let component: CompaniesAddComponent;
  let fixture: ComponentFixture<CompaniesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompaniesAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
