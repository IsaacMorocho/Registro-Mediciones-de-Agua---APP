import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonButtons,      
  IonBackButton, 
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOut, person, checkmarkCircle, logOutOutline, statsChartOutline } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';


addIcons({ logOut, person, checkmarkCircle });

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonText,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonButtons, 
  IonBackButton
  ],
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastController = inject(ToastController);

  currentUser: User | null = null;
  isLoading = false;
  constructor() {
    addIcons({logOutOutline,checkmarkCircle,person,statsChartOutline,logOut});
  }
  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

    goToMeasurements() {
    this.router.navigate(['/admin/measurements']);
  }
  
  logout() {
    this.isLoading = true;
    this.authService.logout().subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/auth']);
      },
      error: (error) => {
        this.isLoading = false;
        this.showToast('Error al cerrar sesión', 'danger');
      },
    });
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
