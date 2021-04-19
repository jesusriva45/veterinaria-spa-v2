import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudServicioComponent } from './crud-servicio.component';

describe('CrudServicioComponent', () => {
  let component: CrudServicioComponent;
  let fixture: ComponentFixture<CrudServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudServicioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
