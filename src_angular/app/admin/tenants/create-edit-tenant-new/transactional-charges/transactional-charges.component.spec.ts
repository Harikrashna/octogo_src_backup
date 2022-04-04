import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionalChargesComponent } from './transactional-charges.component';

describe('TransactionalChargesComponent', () => {
  let component: TransactionalChargesComponent;
  let fixture: ComponentFixture<TransactionalChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionalChargesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionalChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
