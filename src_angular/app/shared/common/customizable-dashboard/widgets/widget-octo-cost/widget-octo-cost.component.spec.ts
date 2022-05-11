import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetOctoCostComponent } from './widget-octo-cost.component';

describe('WidgetOctoCostComponent', () => {
  let component: WidgetOctoCostComponent;
  let fixture: ComponentFixture<WidgetOctoCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetOctoCostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetOctoCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
