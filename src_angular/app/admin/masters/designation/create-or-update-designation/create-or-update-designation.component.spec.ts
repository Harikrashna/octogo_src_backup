import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrUpdateDesignationComponent } from './create-or-update-designation.component';

describe('CreateOrUpdateDesignationComponent', () => {
  let component: CreateOrUpdateDesignationComponent;
  let fixture: ComponentFixture<CreateOrUpdateDesignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrUpdateDesignationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrUpdateDesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
