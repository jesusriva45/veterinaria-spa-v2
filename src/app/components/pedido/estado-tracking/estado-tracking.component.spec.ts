import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoTrackingComponent } from './estado-tracking.component';

describe('EstadoTrackingComponent', () => {
  let component: EstadoTrackingComponent;
  let fixture: ComponentFixture<EstadoTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadoTrackingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
