import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantProductSetupSummaryComponent } from './tenant-product-setup-summary.component';

describe('TenantProductSetupSummaryComponent', () => {
  let component: TenantProductSetupSummaryComponent;
  let fixture: ComponentFixture<TenantProductSetupSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantProductSetupSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantProductSetupSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
