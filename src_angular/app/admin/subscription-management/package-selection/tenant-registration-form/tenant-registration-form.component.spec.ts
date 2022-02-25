import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantRegistrationFormComponent } from './tenant-registration-form.component';

describe('TenantRegistrationFormComponent', () => {
  let component: TenantRegistrationFormComponent;
  let fixture: ComponentFixture<TenantRegistrationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantRegistrationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
