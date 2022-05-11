import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonCompareComponent } from './addon-compare.component';

describe('AddonCompareComponent', () => {
  let component: AddonCompareComponent;
  let fixture: ComponentFixture<AddonCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddonCompareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddonCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
