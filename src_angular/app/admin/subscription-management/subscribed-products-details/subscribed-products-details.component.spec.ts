import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubscribedProductsDetailsComponent } from './subscribed-products-details.component';



describe('SubcribedProductsDetailsComponent', () => {
  let component: SubscribedProductsDetailsComponent;
  let fixture: ComponentFixture<SubscribedProductsDetailsComponent>
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscribedProductsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribedProductsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
