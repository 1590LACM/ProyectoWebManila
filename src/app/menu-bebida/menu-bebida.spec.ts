import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuBebida } from './menu-bebida';

describe('MenuBebida', () => {
  let component: MenuBebida;
  let fixture: ComponentFixture<MenuBebida>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuBebida],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuBebida);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
