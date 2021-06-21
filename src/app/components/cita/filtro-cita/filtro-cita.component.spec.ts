import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroCitaComponent } from './filtro-cita.component';

describe('FiltroCitaComponent', () => {
  let component: FiltroCitaComponent;
  let fixture: ComponentFixture<FiltroCitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltroCitaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroCitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
