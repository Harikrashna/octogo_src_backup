import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingTypeComponent } from './pricing-type.component';

describe('PricingTypeComponent', () => {
  let component: PricingTypeComponent;
  let fixture: ComponentFixture<PricingTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricingTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
