import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from '@angular/fire/firestore';
import { from, Observable, map } from 'rxjs';
import { Measurement } from '../models/measurement.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MeasurementService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  private measurementsCollection = collection(this.firestore, 'measurements');

  /**
   * Crear nueva medición
   */
  createMeasurement(measurement: Omit<Measurement, 'id'>): Observable<string> {
    return from(
      addDoc(this.measurementsCollection, {
        ...measurement,
        createdAt: Timestamp.fromDate(measurement.createdAt),
        updatedAt: Timestamp.fromDate(measurement.updatedAt),
      })
    ).pipe(map((docRef) => docRef.id));
  }

  /**
   * Obtener mediciones del usuario actual (medidor)
   */
  getUserMeasurements(userId: string): Observable<Measurement[]> {
    const q = query(
      this.measurementsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return from(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data['createdAt']?.toDate() || new Date(),
            updatedAt: data['updatedAt']?.toDate() || new Date(),
          } as Measurement;
        })
      )
    );
  }

  /**
   * Obtener todas las mediciones (solo admin)
   */
  getAllMeasurements(): Observable<Measurement[]> {
    const q = query(this.measurementsCollection, orderBy('createdAt', 'desc'));

    return from(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data['createdAt']?.toDate() || new Date(),
            updatedAt: data['updatedAt']?.toDate() || new Date(),
          } as Measurement;
        })
      )
    );
  }

  /**
   * Actualizar medición
   */
  updateMeasurement(id: string, updates: Partial<Measurement>): Observable<void> {
    const docRef = doc(this.measurementsCollection, id);
    return from(
      updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date()),
      })
    );
  }

  /**
   * Eliminar medición
   */
deleteMeasurement(id: string): Observable<void> {
  const docRef = doc(this.measurementsCollection, id);
  return from(deleteDoc(docRef));
}


}