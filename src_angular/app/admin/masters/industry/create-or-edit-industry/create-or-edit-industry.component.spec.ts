import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditIndustryComponent } from './create-or-edit-industry.component';

describe('CreateOrEditIndustryComponent', () => {
  let component: CreateOrEditIndustryComponent;
  let fixture: ComponentFixture<CreateOrEditIndustryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrEditIndustryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrEditIndustryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
