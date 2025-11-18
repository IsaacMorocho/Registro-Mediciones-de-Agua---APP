export interface Measurement {
  id?: string;
  userId: string;
  userDisplayName: string;
  
  // Datos del medidor
  meterValue: number;
  unit: string; // 'm³', 'kWh', etc.
  observations?: string;
  
  // Evidencias fotográficas
  meterPhotoURL?: string; // Foto del medidor
  facadePhotoURL?: string; // Foto de la fachada
  
  // Ubicación
  latitude?: number;
  longitude?: number;
  address?: string;
  
  // Metadatos
  createdAt: Date;
  updatedAt: Date;
}