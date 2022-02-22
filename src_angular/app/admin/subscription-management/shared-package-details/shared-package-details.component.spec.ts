import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedPackageDetailsComponent } from './shared-package-details.component';


describe('SubcribedPackageDetailsComponent', () => {
  let component: SharedPackageDetailsComponent;
  let fixture: ComponentFixture<SharedPackageDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedPackageDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedPackageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
