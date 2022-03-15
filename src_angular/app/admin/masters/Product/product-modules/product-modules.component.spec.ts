import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductModulesComponent } from './product-modules.component';

describe('ProductModulesComponent', () => {
  let component: ProductModulesComponent;
  let fixture: ComponentFixture<ProductModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductModulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
