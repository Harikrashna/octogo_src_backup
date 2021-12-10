import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonslistComponent } from './addonslist.component';

describe('AddonslistComponent', () => {
  let component: AddonslistComponent;
  let fixture: ComponentFixture<AddonslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddonslistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddonslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
