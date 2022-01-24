import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditCountryComponent } from './create-or-edit-country.component';

describe('CreateOrEditCountryComponent', () => {
  let component: CreateOrEditCountryComponent;
  let fixture: ComponentFixture<CreateOrEditCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrEditCountryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrEditCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
