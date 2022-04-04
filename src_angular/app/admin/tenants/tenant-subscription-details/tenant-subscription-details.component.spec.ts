import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantSubscriptionDetailsComponent } from './tenant-subscription-details.component';

describe('TenantSubscriptionDetailsComponent', () => {
  let component: TenantSubscriptionDetailsComponent;
  let fixture: ComponentFixture<TenantSubscriptionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantSubscriptionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantSubscriptionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
