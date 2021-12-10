import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceApproachComponent } from './price-approach.component';

describe('PriceApproachComponent', () => {
  let component: PriceApproachComponent;
  let fixture: ComponentFixture<PriceApproachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceApproachComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceApproachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
