import { Injectable, inject } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from '@angular/fire/auth';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { from, Observable, map, switchMap, of } from 'rxjs';
import { User } from '../models/user.model';
import { DebugService } from './debug.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private debug = inject(DebugService);

  // Observable del estado de autenticación
  authState$ = authState(this.auth);

  // Observable del usuario actual con su rol
  currentUser$: Observable<User | null> = this.authState$.pipe(
    switchMap((authUser) => {
      if (!authUser) {
        return of(null);
      }
      return from(this.getUserFromFirestore(authUser.uid));
    })
  );

  /**
   * Registrar nuevo usuario (solo Medidor)
   * @param email Correo electrónico
   * @param password Contraseña
   * @param displayName Nombre del usuario
   */
register(
  email: string,
  password: string,
  displayName: string
): Observable<User> {
  return from(
    createUserWithEmailAndPassword(this.auth, email, password)
  ).pipe(
    switchMap(async (credential) => {
      // Enviar verificación de correo y esperar
      await sendEmailVerification(credential.user);

      // Crear documento del usuario en Firestore
      const userRef = doc(
        collection(this.firestore, 'users'),
        credential.user.uid
      );
      const newUser: User = {
        uid: credential.user.uid,
        email,
        displayName,
        role: 'medidor',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(userRef, newUser);
      return newUser;
    })
  );
}

  /**
   * Iniciar sesión
   */
  login(email: string, password: string): Observable<User | null> {
    console.log('Intentando login con:', email);
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((credential) => {
        console.log('Autenticación exitosa, UID:', credential.user.uid);
        return from(this.getUserFromFirestore(credential.user.uid));
      })
    );
  }

  /**
   * Cerrar sesión
   */
  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  /**
   * Obtener usuario de Firestore por UID
   */
private async getUserFromFirestore(uid: string): Promise<User | null> {
  try {
    this.debug.log('Buscando usuario en Firestore', uid);
    const userRef = doc(collection(this.firestore, 'users'), uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const userData = docSnap.data() as User;
      
      // ✅ Sincronizar emailVerified desde Firebase Auth
      const authUser = this.auth.currentUser;
      if (authUser) {
        // Recargar para obtener el estado más reciente
        await authUser.reload();
        
        // Si el estado cambió, actualizar Firestore
        if (userData.emailVerified !== authUser.emailVerified) {
          await updateDoc(userRef, { 
            emailVerified: authUser.emailVerified,
            updatedAt: new Date()
          });
          userData.emailVerified = authUser.emailVerified;
        }
      }
      
      this.debug.log('Usuario encontrado', userData);
      return userData;
    } else {
      this.debug.log('Usuario no encontrado en Firestore', uid);
      return null;
    }
  } catch (error) {
    this.debug.log('Error obteniendo usuario', error);
    return null;
  }
}

dVerificationEmail(): Observable<void> {
  const user = this.auth.currentUser;
  if (user && !user.emailVerified) {
    return from(sendEmailVerification(user));
  }
  return from(Promise.reject('No hay usuario o ya está verificado'));
}

  getCurrentUid(): string | null {
    return this.auth.currentUser?.uid || null;
  }


  hasRole(role: 'admin' | 'medidor'): Observable<boolean> {
    return this.currentUser$.pipe(map((user) => user?.role === role));
  }


  updateUserProfile(uid: string, updates: Partial<User>): Observable<void> {
    const userRef = doc(collection(this.firestore, 'users'), uid);
    return from(updateDoc(userRef, { ...updates, updatedAt: new Date() }));
  }
  getUserById(uid: string): Observable<User | null> {
  const userRef = doc(collection(this.firestore, 'users'), uid);
  return from(getDoc(userRef)).pipe(
    map((docSnap) => {
      if (docSnap.exists()) {
        return docSnap.data() as User;
      }
      return null;
    })
  );
}
}
