import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnregisteredUserDashboardComponent } from './unregistered-user-dashboard.component';

describe('UnregisteredUserDashboardComponent', () => {
  let component: UnregisteredUserDashboardComponent;
  let fixture: ComponentFixture<UnregisteredUserDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnregisteredUserDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnregisteredUserDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
