import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesEditComponent } from './companies-edit.component';

describe('CompaniesEditComponent', () => {
  let component: CompaniesEditComponent;
  let fixture: ComponentFixture<CompaniesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompaniesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
