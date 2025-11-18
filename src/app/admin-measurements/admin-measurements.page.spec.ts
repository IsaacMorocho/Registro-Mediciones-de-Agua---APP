import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminMeasuremensPage } from './admin-measurements.page';

describe('AdminMeasuremensPage', () => {
  let component: AdminMeasuremensPage;
  let fixture: ComponentFixture<AdminMeasuremensPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMeasuremensPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
