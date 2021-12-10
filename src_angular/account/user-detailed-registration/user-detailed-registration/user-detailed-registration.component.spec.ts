import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailedRegistrationComponent } from './user-detailed-registration.component';

describe('UserDetailedRegistrationComponent', () => {
  let component: UserDetailedRegistrationComponent;
  let fixture: ComponentFixture<UserDetailedRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDetailedRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailedRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
