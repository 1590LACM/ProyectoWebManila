import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComida } from './menu-comida';

describe('MenuComida', () => {
  let component: MenuComida;
  let fixture: ComponentFixture<MenuComida>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComida],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComida);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
