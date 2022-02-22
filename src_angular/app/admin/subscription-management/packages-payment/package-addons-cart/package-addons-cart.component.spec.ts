import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageAddonsCartComponent } from './package-addons-cart.component';

describe('PackageAddonsCartComponent', () => {
  let component: PackageAddonsCartComponent;
  let fixture: ComponentFixture<PackageAddonsCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageAddonsCartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageAddonsCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
