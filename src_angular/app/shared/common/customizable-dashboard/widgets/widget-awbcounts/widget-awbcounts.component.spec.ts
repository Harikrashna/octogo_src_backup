import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetAwbcountsComponent } from './widget-awbcounts.component';

describe('WidgetAwbcountsComponent', () => {
  let component: WidgetAwbcountsComponent;
  let fixture: ComponentFixture<WidgetAwbcountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetAwbcountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetAwbcountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
