import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTenantSetupProgressComponent } from './shared-tenant-setup-progress.component';

describe('SharedTenantSetupProgressComponent', () => {
  let component: SharedTenantSetupProgressComponent;
  let fixture: ComponentFixture<SharedTenantSetupProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedTenantSetupProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedTenantSetupProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
