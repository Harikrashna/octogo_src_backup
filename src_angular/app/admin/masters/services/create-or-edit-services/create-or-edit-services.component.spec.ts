import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditServicesComponent } from './create-or-edit-services.component';

describe('CreateOrEditServicesComponent', () => {
  let component: CreateOrEditServicesComponent;
  let fixture: ComponentFixture<CreateOrEditServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrEditServicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrEditServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
