import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditAwbCostApproachComponent } from './create-or-edit-awb-cost-approach.component';

describe('CreateOrEditAwbCostApproachComponent', () => {
  let component: CreateOrEditAwbCostApproachComponent;
  let fixture: ComponentFixture<CreateOrEditAwbCostApproachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrEditAwbCostApproachComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrEditAwbCostApproachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
