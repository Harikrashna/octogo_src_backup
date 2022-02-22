import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageDetailedInformationComponent } from './package-detailed-information.component';

describe('PackageDetailedInformationComponent', () => {
  let component: PackageDetailedInformationComponent;
  let fixture: ComponentFixture<PackageDetailedInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageDetailedInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageDetailedInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
