import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Geolocation, Position } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root',
})
export class CapacitorService {

  /**
   * Tomar foto con la cámara y obtenerla como dataUrl (base64)
   */
  async takePhoto(): Promise<Photo> {
    try {
      const image = await Camera.getPhoto({
        quality: 60,                       // baja un poco para no generar base64 gigante
        allowEditing: false,
        resultType: CameraResultType.DataUrl, // 👈 ANTES: CameraResultType.Uri
        source: CameraSource.Camera,
        saveToGallery: false,
      });
      return image;
    } catch (error) {
      console.error('Error tomando foto:', error);
      throw error;
    }
  }

  /**
   * Obtener ubicación actual
   */
  async getCurrentPosition(): Promise<Position> {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
      return position;
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      throw error;
    }
  }

  /**
   * Verificar permisos de ubicación
   */
  async checkLocationPermissions(): Promise<boolean> {
    try {
      const permission = await Geolocation.checkPermissions();
      if (permission.location === 'granted') {
        return true;
      }

      const request = await Geolocation.requestPermissions();
      return request.location === 'granted';
    } catch (error) {
      console.error('Error verificando permisos de ubicación:', error);
      return false;
    }
  }

  /**
   * Verificar permisos de cámara
   */
  async checkCameraPermissions(): Promise<boolean> {
    try {
      const permission = await Camera.checkPermissions();
      if (permission.camera === 'granted' && permission.photos === 'granted') {
        return true;
      }

      const request = await Camera.requestPermissions();
      return request.camera === 'granted' && request.photos === 'granted';
    } catch (error) {
      console.error('Error verificando permisos de cámara:', error);
      return false;
    }
  }

}