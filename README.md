# AguApp

Joshua Morocho

## Descripción

AguApp es una aplicación móvil desarrollada con **Ionic** y **Angular** que permite gestionar y monitorear mediciones de agua. La app proporciona diferentes interfaces según el rol del usuario: administrador o medidor.

## Funcionalidades Principales

- **Autenticación de usuarios**: Ingreso seguro con validación de credenciales mediante Firebase
- **Dashboard de Medidor**: Visualiza y registra mediciones de 
consumo de agua
- **Panel de Administrador**: Gestiona usuarios, revisa todas las mediciones y administra la plataforma
- **Geolocalización**: Captura la ubicación del medidor para registrar mediciones
- **Cámara**: Toma fotos de los medidores para documentar las lecturas
- **Control de Acceso**: Sistema de roles y guardias de rutas para proteger funcionalidades

## Estructura del Proyecto

```
aguApp/
├── src/
│   ├── app/
│   │   ├── auth/              # Módulo de autenticación
│   │   ├── dashboard/         # Panel del medidor
│   │   ├── admin/             # Panel del administrador
│   │   ├── admin-measurements/# Gestión de mediciones
│   │   ├── new-measurement/   # Crear nueva medición
│   │   ├── services/          # Servicios (API, Auth, etc.)
│   │   ├── models/            # Modelos de datos
│   │   └── guards/            # Guardias de autenticación y roles
│   └── assets/                # Recursos estáticos
├── android/                   # Configuración para Android
└── package.json               # Dependencias del proyecto
```

## Tecnologías Utilizadas

- **Framework**: Ionic 8 + Angular 20
- **Backend**: Firebase para la autenticacion y la base de daos 
- **Capacitor**: Acceso a funciones como la cámara y geolocalización


## Acceso

- **Rol Medidor**: Registra y visualiza mediciones de agua
  
<img width="714" height="1599" alt="image" src="https://github.com/user-attachments/assets/6378e766-1106-4f5d-afc7-9aa4684b12bf" />

<img width="714" height="1599" alt="image" src="https://github.com/user-attachments/assets/749d7e65-1ba5-40dd-aced-c6567bf25f4e" />

Puede crear nuevas mediciones con el modal:

<img width="714" height="1599" alt="image" src="https://github.com/user-attachments/assets/0aa766e1-e3b6-483b-a2c1-879e8ed06e48" />

- **Rol Administrador**: Gestiona usuarios y revisa todas las mediciones
- **Credenciales**: admin123@ejemplo.com - admin2002

<img width="714" height="1599" alt="image" src="https://github.com/user-attachments/assets/1a393751-8751-454b-8d69-6930b6107a1a" />

<img width="714" height="1599" alt="image" src="https://github.com/user-attachments/assets/392654f3-6554-496d-a489-91c3ab443fd8" />

<img width="714" height="1599" alt="image" src="https://github.com/user-attachments/assets/4554ee1a-3ed8-4da7-9442-41743d7df35d" />

- **Pantalla de registro para el rol Medidor**:

  <img width="714" height="1599" alt="image" src="https://github.com/user-attachments/assets/044fdf6b-fe39-40a6-a95f-d7086ac186a8" />

## El apk se encuentra en la raiz del proyecto con el nombre: **AguApp**.
