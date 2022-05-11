import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetCurrentProductAndPackageComponent } from './widget-current-product-and-package.component';

describe('WidgetCurrentProductAndPackageComponent', () => {
  let component: WidgetCurrentProductAndPackageComponent;
  let fixture: ComponentFixture<WidgetCurrentProductAndPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetCurrentProductAndPackageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetCurrentProductAndPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
