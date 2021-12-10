import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertUpdateAddonsComponent } from './insert-update-addons.component';

describe('InsertUpdateAddonsComponent', () => {
  let component: InsertUpdateAddonsComponent;
  let fixture: ComponentFixture<InsertUpdateAddonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertUpdateAddonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertUpdateAddonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
