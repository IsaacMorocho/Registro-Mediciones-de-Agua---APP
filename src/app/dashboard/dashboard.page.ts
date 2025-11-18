import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonFab,
  IonFabButton,
  IonSpinner,
  IonText,
  IonAvatar,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
    IonButtons, 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add,
  cameraOutline,
  locationOutline,
  logOutOutline,
  statsChartOutline,
} from 'ionicons/icons';
import { AuthService } from '../services/auth.service';
import { MeasurementService } from '../services/measurement.service';
import { Measurement } from '../models/measurement.model';
import { User } from '../models/user.model';
import { AppLauncher } from '@capacitor/app-launcher'; // 👈 Import para abrir apps

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonFab,
    IonFabButton,
    IonSpinner,
    IonText,
    IonAvatar,
    IonChip,
    IonGrid,
    IonRow,
    IonCol,
    IonButtons, 
  ],
})
export class DashboardPage implements OnInit {
  private authService = inject(AuthService);
  private measurementService = inject(MeasurementService);
  private router = inject(Router);

  currentUser: User | null = null;
  measurements: Measurement[] = [];
  isLoading = true;

  get totalMeasurements(): number {
    return this.measurements.length;
  }

  get measurementsWithPhoto(): number {
    return this.measurements.filter(m => m.meterPhotoURL).length;
  }

  constructor() {
    addIcons({
      add,
      cameraOutline,
      locationOutline,
      logOutOutline,
      statsChartOutline,
    });
  }

  ngOnInit() {
    this.loadUserAndMeasurements();
  }

  loadUserAndMeasurements() {
    this.authService.currentUser$.subscribe({
      next: (user) => {
        this.currentUser = user;
        if (user) {
          this.loadMeasurements(user.uid);
        }
      },
    });
  }

  loadMeasurements(userId: string) {
    this.isLoading = true;
    this.measurementService.getUserMeasurements(userId).subscribe({
      next: (measurements) => {
        this.measurements = measurements;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando mediciones:', error);
        this.isLoading = false;
      },
    });
  }

  createNewMeasurement() {
    this.router.navigate(['/new-measurement']);
  }

  // 👇 NUEVO MÉTODO PARA ABRIR GOOGLE MAPS
  async openInMaps(lat?: number, lng?: number) {
    if (!lat || !lng) {
      console.warn('Coordenadas no disponibles');
      return;
    }

    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

    try {
      const canOpen = await AppLauncher.canOpenUrl({ url });
      if (canOpen.value) {
        await AppLauncher.openUrl({ url });
      } else {
        // Si no puede abrir la app, abre en el navegador
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Error abriendo Google Maps:', error);
      // Fallback: abrir en navegador
      window.open(url, '_blank');
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/auth', { replaceUrl: true });
      },
      error: (error) => {
        console.error('Error cerrando sesión:', error);
      }
    });
  }
}