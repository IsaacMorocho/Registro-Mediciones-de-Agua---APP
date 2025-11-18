import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewMeasurementPage } from './new-measurement.page';

describe('NewMeasurementPage', () => {
  let component: NewMeasurementPage;
  let fixture: ComponentFixture<NewMeasurementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMeasurementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
