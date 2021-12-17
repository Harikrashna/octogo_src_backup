import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredUserEditionSelectionComponent } from './registered-user-edition-selection.component';

describe('RegisteredUserEditionSelectionComponent', () => {
  let component: RegisteredUserEditionSelectionComponent;
  let fixture: ComponentFixture<RegisteredUserEditionSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisteredUserEditionSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredUserEditionSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
