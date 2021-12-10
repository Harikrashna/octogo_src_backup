import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditPricingApproachModalComponent } from './create-or-edit-pricing-approach-modal.component';

describe('CreateOrEditPricingApproachModalComponent', () => {
  let component: CreateOrEditPricingApproachModalComponent;
  let fixture: ComponentFixture<CreateOrEditPricingApproachModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrEditPricingApproachModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrEditPricingApproachModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
