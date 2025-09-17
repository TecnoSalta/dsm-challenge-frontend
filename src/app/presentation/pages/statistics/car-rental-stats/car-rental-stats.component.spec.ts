import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarRentalStatsComponent } from './car-rental-stats.component';

describe('CarRentalStatsComponent', () => {
  let component: CarRentalStatsComponent;
  let fixture: ComponentFixture<CarRentalStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarRentalStatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarRentalStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
