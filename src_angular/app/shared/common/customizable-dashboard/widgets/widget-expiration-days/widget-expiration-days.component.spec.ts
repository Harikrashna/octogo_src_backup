import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetExpirationDaysComponent } from './widget-expiration-days.component';

describe('WidgetExpirationDaysComponent', () => {
  let component: WidgetExpirationDaysComponent;
  let fixture: ComponentFixture<WidgetExpirationDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetExpirationDaysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetExpirationDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
