import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditPricingTypeModalComponent } from './create-or-edit-pricing-type-modal.component';

describe('CreateOrEditPricingTypeModalComponent', () => {
  let component: CreateOrEditPricingTypeModalComponent;
  let fixture: ComponentFixture<CreateOrEditPricingTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrEditPricingTypeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrEditPricingTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
