import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductUserTypeComponent } from './product-user-type.component';

describe('ProductUserTypeComponent', () => {
  let component: ProductUserTypeComponent;
  let fixture: ComponentFixture<ProductUserTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductUserTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductUserTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
