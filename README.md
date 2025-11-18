# AguApp

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
- **Backend**: Firebase (autenticación y base de datos)
- **Capacitor**: Acceso a funciones nativas (cámara, geolocalización)
- **TypeScript**: Lenguaje de programación
- **SCSS**: Estilos

## Cómo Ejecutar

### Requisitos
- Node.js instalado
- Ionic CLI: `npm install -g @ionic/cli`

### Pasos

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Inicia el servidor de desarrollo:
   ```bash
   npm start
   ```

3. Abre la app en el navegador (por defecto en `http://localhost:4200`)

4. Para compilar para Android:
   ```bash
   npm run build
   ```

## Acceso

- **Rol Medidor**: Registra y visualiza mediciones de agua
- **Rol Administrador**: Gestiona usuarios y revisa todas las mediciones

---

*Proyecto de ejercicio con Ionic Framework*
