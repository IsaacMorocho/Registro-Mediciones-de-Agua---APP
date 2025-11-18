import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonSpinner,
  IonText,
  IonBackButton,
  IonButtons,
  ToastController,
  LoadingController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cameraOutline, locationOutline, saveOutline, closeCircle } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';
import { MeasurementService } from '../services/measurement.service';
import { CapacitorService } from '../services/capacitor.service';
import { Measurement } from '../models/measurement.model';
import { Photo } from '@capacitor/camera';

@Component({
  selector: 'app-new-measurement',
  templateUrl: './new-measurement.page.html',
  styleUrls: ['./new-measurement.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonSpinner,
    IonText,
    IonBackButton,
    IonButtons,
  ],
})
export class NewMeasurementPage implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private measurementService = inject(MeasurementService);
  private capacitorService = inject(CapacitorService);
  private router = inject(Router);
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);

  measurementForm!: FormGroup;
  meterPhoto: Photo | null = null;
  facadePhoto: Photo | null = null;
  currentLocation: { lat: number; lng: number; address: string } | null = null;
  isSubmitting = false;

  constructor() {
    addIcons({ cameraOutline, locationOutline, saveOutline, closeCircle });
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.measurementForm = this.fb.group({
      meterValue: ['', [Validators.required, Validators.min(0)]],
      unit: ['m³', [Validators.required]],
      observations: [''],
    });
  }

async takeMeterPhoto() {
  try {
    const hasPermission: boolean = await this.capacitorService.checkCameraPermissions();
    if (!hasPermission) {
      this.showToast('Se necesitan permisos de cámara', 'warning');
      return;
    }

    const photo: Photo = await this.capacitorService.takePhoto();
    this.meterPhoto = photo;
    this.showToast('Foto del medidor capturada', 'success');
  } catch (error) {
    console.error('Error tomando foto del medidor:', error);
    this.showToast('Error al tomar la foto', 'danger');
  }
}

async takeFacadePhoto() {
  try {
    const hasPermission: boolean = await this.capacitorService.checkCameraPermissions();
    if (!hasPermission) {
      this.showToast('Se necesitan permisos de cámara', 'warning');
      return;
    }

    const photo: Photo = await this.capacitorService.takePhoto();
    this.facadePhoto = photo;
    this.showToast('Foto de la fachada capturada', 'success');
  } catch (error) {
    console.error('Error tomando foto de fachada:', error);
    this.showToast('Error al tomar la foto', 'danger');
  }
}

async getLocation() {
  const loading = await this.loadingController.create({
    message: 'Obteniendo ubicación...',
  });
  await loading.present();

  try {
    const hasPermission: boolean = await this.capacitorService.checkLocationPermissions();
    if (!hasPermission) {
      await loading.dismiss();
      this.showToast('Se necesitan permisos de ubicación', 'warning');
      return;
    }

    const position = await this.capacitorService.getCurrentPosition();
    this.currentLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
    };

    await loading.dismiss();
    this.showToast('Ubicación obtenida correctamente', 'success');
  } catch (error) {
    await loading.dismiss();
    console.error('Error obteniendo ubicación:', error);
    this.showToast('Error al obtener ubicación', 'danger');
  }
}

  removeMeterPhoto() {
    this.meterPhoto = null;
  }

  removeFacadePhoto() {
    this.facadePhoto = null;
  }

async submitMeasurement() {
    console.log('>>> NUEVA VERSION BASE64, SIN STORAGE <<<');

  if (this.measurementForm.invalid) {
    this.showToast('Por favor completa todos los campos requeridos', 'warning');
    return;
  }

  if (!this.meterPhoto) {
    this.showToast('La foto del medidor es obligatoria', 'warning');
    return;
  }

  if (!this.currentLocation) {
    this.showToast('La ubicación es obligatoria', 'warning');
    return;
  }

  const loading = await this.loadingController.create({
    message: 'Guardando medición...',
  });
  await loading.present();

  try {
    this.isSubmitting = true;

    // Obtener usuario actual
    const user = await new Promise<any>((resolve, reject) => {
      this.authService.currentUser$.subscribe({
        next: (u) => resolve(u),
        error: (e) => reject(e),
      });
    });

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    // Subir foto del medidor
// Obtener base64/dataUrl de la foto del medidor
// Obtener base64/dataUrl de la foto del medidor
const meterPhotoURL = this.meterPhoto.dataUrl;
if (!meterPhotoURL) {
  throw new Error('No se pudo obtener la imagen del medidor en base64');
}

// Obtener base64/dataUrl de la foto de la fachada (si existe)
let facadePhotoURL: string | undefined;
if (this.facadePhoto && this.facadePhoto.dataUrl) {
  facadePhotoURL = this.facadePhoto.dataUrl;
}
    // Crear medición
    const measurement: Omit<Measurement, 'id'> = {
      userId: user.uid,
      userDisplayName: user.displayName || user.email,
      meterValue: this.measurementForm.value.meterValue,
      unit: this.measurementForm.value.unit,
      observations: this.measurementForm.value.observations,
      meterPhotoURL,
      facadePhotoURL,
      latitude: this.currentLocation.lat,
      longitude: this.currentLocation.lng,
      address: this.currentLocation.address,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await new Promise<void>((resolve, reject) => {
      this.measurementService.createMeasurement(measurement).subscribe({
        next: () => resolve(),
        error: (e) => reject(e),
      });
    });
    await loading.dismiss();
    this.showToast('✅ Medición registrada exitosamente', 'success');
    this.router.navigate(['/dashboard']);
  } catch (error) {
    await loading.dismiss();
    console.error('Error guardando medición:', error);
    this.showToast('Error al guardar la medición', 'danger');
  } finally {
    this.isSubmitting = false;
  }
}

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color,
    });
    await toast.present();
  }
}