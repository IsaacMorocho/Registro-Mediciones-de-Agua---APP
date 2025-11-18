import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonSegment, IonSegmentButton, IonText, IonTitle, IonToolbar, IonSpinner, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { DebugService } from '../services/debug.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonList,
    IonSegment,
    IonSegmentButton,
    IonText,
    IonSpinner,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
  ],
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastController = inject(ToastController);
  private fb = inject(FormBuilder);
  private debug = inject(DebugService);

  loginForm!: FormGroup;
  registerForm!: FormGroup;
  activeTab: string = 'login';
  userType: 'admin' | 'medidor' = 'medidor';
  isLoading = false;

  ngOnInit() {
    this.debug.checkFirebaseConnection();
    this.initForms();
  }

  onTabChange(event: any) {
    this.activeTab = event.detail.value || 'login';
  }

  onUserTypeChange(event: any) {
    this.userType = event.detail.value || 'medidor';
  }

  initForms() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      displayName: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

login() {
  if (this.loginForm.invalid) {
    this.showToast('Por favor completa todos los campos', 'warning');
    return;
  }

  this.isLoading = true;
  const { email, password } = this.loginForm.value;

  this.authService.login(email, password).subscribe({
    next: (user) => {
      this.isLoading = false;
      if (user) {
        // ✅ Validar que el rol seleccionado coincida con el rol real
        if (user.role !== this.userType) {
          this.showToast(
            `Este usuario es "${user.role}". Por favor selecciona el tipo correcto.`,
            'warning'
          );
          // Cerrar sesión automáticamente
          this.authService.logout().subscribe();
          return;
        }

        // ✅ Para medidores, verificar que el email esté verificado
        if (user.role === 'medidor' && !user.emailVerified) {
          this.showToast(
            'Por favor verifica tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada.',
            'warning'
          );
          this.authService.logout().subscribe();
          return;
        }

        // Redirigir según el rol
        if (user.role === 'admin') {
          this.router.navigateByUrl('/admin', { replaceUrl: true });
        } else if (user.role === 'medidor') {
          this.router.navigateByUrl('/dashboard', { replaceUrl: true });
        }
      }
    },
    error: (error) => {
      this.isLoading = false;
      this.handleError(error);
    },
  });
}

register() {
  if (this.registerForm.invalid) {
    this.showToast('Por favor completa todos los campos correctamente', 'warning');
    return;
  }

  if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
    this.showToast('Las contraseñas no coinciden', 'warning');
    return;
  }

  this.isLoading = true;
  const { email, password, displayName } = this.registerForm.value;

  this.authService.register(email, password, displayName).subscribe({
    next: () => {
      this.isLoading = false;
      this.showToast(
        '✅ Registro exitoso! Revisa tu correo para verificar tu cuenta. El link expira en 24 horas.',
        'success'
      );
      
      // Cerrar sesión automáticamente (Firebase loguea al registrar)
      this.authService.logout().subscribe();
      
      this.registerForm.reset();
      this.activeTab = 'login';
    },
    error: (error) => {
      this.isLoading = false;
      this.handleError(error);
    },
  });
}

resendVerification() {
  if (this.loginForm.invalid) {
    this.showToast('Por favor ingresa tu correo y contraseña primero', 'warning');
    return;
  }

  this.isLoading = true;
  const { email, password } = this.loginForm.value;

  // Primero hacer login para obtener el usuario
  this.authService.login(email, password).subscribe({
    next: (user) => {
      if (user && !user.emailVerified) {
        // Reenviar email
        this.authService.dVerificationEmail().subscribe({
          next: () => {
            this.isLoading = false;
            this.showToast('Email de verificación reenviado. Revisa tu bandeja.', 'success');
            this.authService.logout().subscribe();
          },
          error: (error) => {
            this.isLoading = false;
            this.showToast('Error al reenviar email: ' + error.message, 'danger');
          }
        });
      } else {
        this.isLoading = false;
        this.showToast('Tu email ya está verificado o no existe el usuario', 'info');
        this.authService.logout().subscribe();
      }
    },
    error: (error) => {
      this.isLoading = false;
      this.handleError(error);
    },
  });
}
  private handleError(error: any) {
    let message = 'Ocurrió un error';

    console.error('Error de autenticación:', error);

    if (error.code === 'auth/user-not-found') {
      message = 'Usuario no encontrado. Verifica tu correo.';
    } else if (error.code === 'auth/wrong-password') {
      message = 'Contraseña incorrecta.';
    } else if (error.code === 'auth/email-already-in-use') {
      message = 'El correo ya está registrado.';
    } else if (error.code === 'auth/weak-password') {
      message = 'La contraseña es muy débil.';
    } else if (error.code === 'auth/invalid-email') {
      message = 'El correo electrónico no es válido.';
    } else if (error.code === 'auth/too-many-requests') {
      message = 'Demasiados intentos. Intenta más tarde.';
    } else if (error.message) {
      message = error.message;
    }

    this.showToast(message, 'danger');
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
