import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditCityComponent } from './create-or-edit-city.component';

describe('CreateOrEditCityComponent', () => {
  let component: CreateOrEditCityComponent;
  let fixture: ComponentFixture<CreateOrEditCityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrEditCityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrEditCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
