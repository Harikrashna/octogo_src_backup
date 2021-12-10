import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditUsertypeComponent } from './create-or-edit-usertype.component';

describe('CreateOrEditUsertypeComponent', () => {
  let component: CreateOrEditUsertypeComponent;
  let fixture: ComponentFixture<CreateOrEditUsertypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrEditUsertypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrEditUsertypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
