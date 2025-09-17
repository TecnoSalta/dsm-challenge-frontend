import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextCarServicesComponent } from './next-car-services.component';

describe('NextCarServicesComponent', () => {
  let component: NextCarServicesComponent;
  let fixture: ComponentFixture<NextCarServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextCarServicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NextCarServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
