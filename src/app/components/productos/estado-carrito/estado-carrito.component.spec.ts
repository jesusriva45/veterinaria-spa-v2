import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoCarritoComponent } from './estado-carrito.component';

describe('EstadoCarritoComponent', () => {
  let component: EstadoCarritoComponent;
  let fixture: ComponentFixture<EstadoCarritoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadoCarritoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoCarritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
