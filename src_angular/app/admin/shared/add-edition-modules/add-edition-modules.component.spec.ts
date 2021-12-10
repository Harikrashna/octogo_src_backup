import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditionModulesComponent } from './add-edition-modules.component';

describe('AddEditionModulesComponent', () => {
  let component: AddEditionModulesComponent;
  let fixture: ComponentFixture<AddEditionModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditionModulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditionModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
