import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonAvatar,
  IonButton,
  IonButtons,
  IonBackButton,
  IonSpinner,
  IonText,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  ToastController,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  locationOutline,
  trashOutline,
  personOutline,
  imageOutline, statsChartOutline } from 'ionicons/icons';
import { MeasurementService } from '../services/measurement.service';
import { AuthService } from '../services/auth.service';
import { Measurement } from '../models/measurement.model';
import { AppLauncher } from '@capacitor/app-launcher';
import { User } from '../models/user.model';

@Component({
  selector: 'app-admin-measurements',
  templateUrl: './admin-measurements.page.html',
  styleUrls: ['./admin-measurements.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonAvatar,
    IonButton,
    IonButtons,
    IonBackButton,
    IonSpinner,
    IonText,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonGrid,
    IonRow,
    IonCol,
    IonBadge,
  ],
})
export class AdminMeasurementsPage implements OnInit {
  private measurementService = inject(MeasurementService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastController = inject(ToastController);
  private alertController = inject(AlertController);

  measurements: Measurement[] = [];
  usersMap = new Map<string, User>(); // Cache de usuarios
  isLoading = true;
  currentUser: User | null = null;

  constructor() {
    addIcons({personOutline,locationOutline,trashOutline,statsChartOutline,imageOutline,});
  }

  async ngOnInit() {
    // Verificar que sea admin
    this.authService.hasRole('admin').subscribe((isAdmin) => {
      if (!isAdmin) {
        this.router.navigate(['/dashboard']);
        return;
      }
    });

    this.loadMeasurements();
  }

  loadMeasurements() {
    this.isLoading = true;
    this.measurementService.getAllMeasurements().subscribe({
      next: async (measurements) => {
        this.measurements = measurements;
        // Cargar datos de usuarios únicos
        const userIds = [...new Set(measurements.map(m => m.userId))];
        await this.loadUsers(userIds);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando mediciones:', error);
        this.showToast('Error al cargar mediciones', 'danger');
        this.isLoading = false;
      },
    });
  }

  async loadUsers(userIds: string[]) {
    for (const userId of userIds) {
      const user = await this.authService.getUserById(userId).toPromise();
      if (user) {
        this.usersMap.set(userId, user);
      }
    }
  }

  getUserDisplayName(userId: string): string {
    return this.usersMap.get(userId)?.displayName || 'Usuario desconocido';
  }

  // 👇 Abrir ubicación en Google Maps
  async openInMaps(lat?: number, lng?: number) {
    if (!lat || !lng) return;

    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    try {
      const canOpen = await AppLauncher.canOpenUrl({ url });
      if (canOpen.value) {
        await AppLauncher.openUrl({ url });
      } else {
        window.open(url, '_blank');
      }
    } catch (error) {
      window.open(url, '_blank');
    }
  }

  // 👇 Eliminar medición (solo admin)
  async deleteMeasurement(measurement: Measurement) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de eliminar esta medición de ${measurement.meterValue} ${measurement.unit}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              await this.measurementService.deleteMeasurement(measurement.id!).toPromise();
              this.showToast('Medición eliminada correctamente', 'success');
              this.loadMeasurements(); 
            } catch (error) {
              console.error('Error eliminando medición:', error);
              this.showToast('Error al eliminar medición', 'danger');
            }
          },
        },
      ],
    });
    await alert.present();
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