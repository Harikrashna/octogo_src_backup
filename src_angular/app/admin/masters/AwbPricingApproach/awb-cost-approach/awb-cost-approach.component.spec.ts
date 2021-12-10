import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwbCostApproachComponent } from './awb-cost-approach.component';

describe('AwbCostApproachComponent', () => {
  let component: AwbCostApproachComponent;
  let fixture: ComponentFixture<AwbCostApproachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwbCostApproachComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AwbCostApproachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
