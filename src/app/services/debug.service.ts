import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class DebugService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  /**
   * Verificar conexión a Firebase
   */
  checkFirebaseConnection(): void {
    console.log('=== Firebase Debug Info ===');
    console.log('Auth initialized:', !!this.auth);
    console.log('Firestore initialized:', !!this.firestore);
    console.log('Auth current user:', this.auth.currentUser);
    console.log('Auth app:', this.auth.app?.options?.projectId);
    console.log('==========================');
  }

  /**
   * Logging detallado
   */
  log(title: string, data: any): void {
    console.log(`[${new Date().toLocaleTimeString()}] ${title}:`, data);
  }
}
