# 🎮 GameCampus — App Gamer Universitaria

> Aplicación móvil y web desarrollada con **Ionic + Angular + Capacitor**, respaldada por **Supabase** como backend. Permite registrar videojuegos, gestionar encuestas del campus, capturar evidencia fotográfica y ubicación GPS, con un tablero de análisis en tiempo real desplegado en Firebase Hosting.

---

## 📋 Tabla de contenidos

- [Descripción general](#descripción-general)
- [Características principales](#características-principales)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Arquitectura del proyecto](#arquitectura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación y configuración](#instalación-y-configuración)
- [Variables de entorno](#variables-de-entorno)
- [Estructura de la base de datos](#estructura-de-la-base-de-datos)
- [Módulos de la aplicación](#módulos-de-la-aplicación)
- [APIs externas integradas](#apis-externas-integradas)
- [Dashboard web](#dashboard-web)
- [Compilación y despliegue](#compilación-y-despliegue)
- [APK Android](#apk-android)

---

## 📖 Descripción general

**GameCampus** es una aplicación multiplataforma orientada a la comunidad universitaria. Su propósito es:

1. **Catálogo de videojuegos** — CRUD completo de títulos con plataforma, precio, stock e imagen.
2. **Registros de entrevistados** — Captura datos de personas encuestadas en el campus, con foto de evidencia.
3. **Encuestas gamer** — Formulario enriquecido con datos personales, preferencias de juego, ubicación GPS, foto y consulta a APIs externas de videojuegos.
4. **Tablero analítico** — Dashboard web en tiempo real con KPIs, gráficos y tabla de registros, desplegado en Firebase Hosting.
5. **Página de promoción** — Vista para compartir el enlace de descarga del APK.

---

## ✨ Características principales

| Funcionalidad | Descripción |
|---|---|
| 🔐 Autenticación | Login y registro con Supabase Auth (email/password) |
| 🎮 CRUD Videojuegos | Crear, leer, actualizar y eliminar videojuegos |
| 👥 Registros | Registro de personas con foto tomada desde cámara |
| 📋 Encuestas | Formulario con 5 secciones: datos, preferencias, GPS, foto y API |
| 📍 GPS | Captura de coordenadas con `navigator.geolocation` |
| 📸 Cámara / Galería | Acceso a cámara nativa y galería mediante `@capacitor/camera` |
| 🌐 APIs externas | Búsqueda de info de juegos en RAWG, FreeToGame y CheapShark |
| ☁️ Storage | Subida de fotos al bucket `evidencias` de Supabase Storage |
| 📊 Dashboard | Tablero web con Chart.js, KPIs, gráficos y tabla (auto-refresca cada 30s) |
| 📱 Android | APK generada con Capacitor para distribución directa |
| 🔗 Compartir | Función de compartir enlace de descarga con `@capacitor/share` |
| 📋 Portapapeles | Copiar enlace con `@capacitor/clipboard` |

---

## 🛠 Tecnologías utilizadas

### Frontend
- **[Ionic Framework 8](https://ionicframework.com/)** — UI Components
- **[Angular 18](https://angular.io/)** — Framework principal (Standalone Components)
- **[Capacitor 7](https://capacitorjs.com/)** — Acceso a APIs nativas

### Backend / Servicios
- **[Supabase](https://supabase.com/)** — Base de datos PostgreSQL, Auth y Storage
- **[Firebase Hosting](https://firebase.google.com/products/hosting)** — Hosting del dashboard web

### APIs externas
- **[RAWG.io](https://rawg.io/apidocs)** — Información detallada de videojuegos
- **[FreeToGame](https://www.freetogame.com/api-doc)** — Juegos gratuitos
- **[CheapShark](https://apidocs.cheapshark.com/)** — Precios de juegos en Steam

### Plugins de Capacitor
| Plugin | Uso |
|---|---|
| `@capacitor/camera` | Cámara y galería de fotos |
| `@capacitor/share` | Compartir contenido nativo |
| `@capacitor/clipboard` | Copiar al portapapeles |
| `@capacitor/haptics` | Vibración |
| `@capacitor/keyboard` | Manejo del teclado |
| `@capacitor/status-bar` | Barra de estado |
| `@capacitor/app` | Eventos de ciclo de vida |

---

## 🏗 Arquitectura del proyecto

```
videojuegos-crud/
├── src/
│   ├── app/
│   │   ├── guards/
│   │   │   └── auth.guard.ts          # Protección de rutas con Supabase session
│   │   ├── pages/
│   │   │   ├── login/                 # Login + Registro de usuario
│   │   │   ├── tabs/                  # Navegación por pestañas (TabBar)
│   │   │   ├── videojuegos/           # Lista de videojuegos
│   │   │   ├── videojuego-form/       # Formulario crear/editar videojuego
│   │   │   ├── registros/             # Lista de personas registradas
│   │   │   ├── registro-form/         # Formulario de registro con foto
│   │   │   ├── encuestas/             # Lista de encuestas
│   │   │   ├── encuesta-form/         # Formulario completo de encuesta
│   │   │   └── promo/                 # Página de promoción y descarga APK
│   │   ├── services/
│   │   │   ├── auth.service.ts        # Autenticación Supabase
│   │   │   ├── videojuegos.ts         # CRUD videojuegos
│   │   │   ├── registros.service.ts   # CRUD registros + upload foto
│   │   │   └── encuestas.service.ts   # CRUD encuestas + GPS + API + upload foto
│   │   ├── app.routes.ts              # Definición de rutas
│   │   └── app.component.ts           # Componente raíz
│   ├── environments/
│   │   ├── environment.ts             # Config desarrollo
│   │   └── environment.prod.ts        # Config producción
│   └── main.ts                        # Bootstrap + PWA Elements
├── android/                           # Proyecto Android (Capacitor)
├── dashboard/                         # Dashboard web estático (Firebase Hosting)
│   └── index.html                     # Tablero con Chart.js + Supabase JS
└── .firebase/                         # Caché de Firebase CLI
```

---

## ✅ Requisitos previos

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **Ionic CLI** — `npm install -g @ionic/cli`
- **Angular CLI** — `npm install -g @angular/cli`
- **Capacitor CLI** — incluido en devDependencies
- **Android Studio** (solo para compilar APK)
- Cuenta en [Supabase](https://supabase.com/) (gratuita)
- Cuenta en [Firebase](https://firebase.google.com/) (gratuita, solo para el dashboard)

---

## 🚀 Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU-USUARIO/TU-REPO.git
cd TU-REPO
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Edita los archivos `src/environments/environment.ts` y `src/environments/environment.prod.ts` con tus credenciales (ver sección [Variables de entorno](#variables-de-entorno)).

### 4. Ejecutar en el navegador

```bash
ionic serve
```

La app estará disponible en `http://localhost:8100`.

### 5. Sincronizar con Android

```bash
ionic build
npx cap sync android
npx cap open android
```

---


## 🗄 Estructura de la base de datos

El proyecto utiliza tres tablas en Supabase PostgreSQL:

### Tabla `videojuegos`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `bigint` (PK) | ID autoincremental |
| `titulo` | `text` | Nombre del videojuego |
| `plataforma` | `text` | PC, PS5, Xbox, etc. |
| `precio` | `numeric` | Precio en dólares |
| `stock` | `integer` | Unidades disponibles |
| `categoria` | `text` | Género del juego |
| `imagen_url` | `text` | URL de la imagen de portada |

### Tabla `registros`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `bigint` (PK) | ID autoincremental |
| `nombre` | `text` | Nombre completo del entrevistado |
| `carrera` | `text` | Carrera universitaria |
| `email` | `text` | Correo electrónico |
| `videojuego_favorito` | `text` | Juego preferido |
| `plataforma_favorita` | `text` | Plataforma preferida |
| `foto_url` | `text` | URL de la foto de evidencia (Storage) |
| `created_at` | `timestamptz` | Fecha de creación (auto) |

### Tabla `encuestas`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `bigint` (PK) | ID autoincremental |
| `user_id` | `uuid` | ID del usuario autenticado |
| `alias` | `text` | Nombre o alias del encuestado |
| `edad_rango` | `text` | Rango de edad |
| `rol` | `text` | estudiante / docente / administrativo / visitante |
| `videojuego` | `text` | Videojuego favorito |
| `plataforma` | `text` | Plataforma preferida |
| `genero_juego` | `text` | Género de juego favorito |
| `comentario` | `text` | Comentario libre |
| `foto_url` | `text` | URL de foto de evidencia (Storage) |
| `latitud` | `float8` | Coordenada GPS |
| `longitud` | `float8` | Coordenada GPS |
| `lugar` | `text` | Lugar del campus |
| `fecha_hora` | `timestamptz` | Fecha/hora del registro |
| `api_nombre` | `text` | Nombre del juego desde API |
| `api_imagen` | `text` | Imagen desde API |
| `api_genero` | `text` | Género desde API |
| `api_plataforma` | `text` | Plataforma desde API |
| `api_rating` | `text` | Rating desde API |
| `api_descripcion` | `text` | Descripción desde API |

### Storage

Se utiliza un bucket llamado **`evidencias`** con dos carpetas:
- `encuestas/` — fotos de las encuestas
- `fotos/` — fotos de los registros

### Row Level Security (RLS)

Para que el dashboard público pueda leer encuestas sin autenticación, ejecuta en el SQL Editor de Supabase:

```sql
-- Lectura pública de encuestas (necesario para el dashboard)
CREATE POLICY "public read" ON encuestas
  FOR SELECT USING (true);

-- Solo el usuario autenticado puede insertar/eliminar sus encuestas
CREATE POLICY "user insert" ON encuestas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user delete" ON encuestas
  FOR DELETE USING (auth.uid() = user_id);
```

---

## 📱 Módulos de la aplicación

### 🔐 Login (`/login`)
- Tabs para alternar entre **Iniciar sesión** y **Crear cuenta**
- Validaciones de campos y mensajes de error traducidos al español
- Toggle para mostrar/ocultar contraseña
- Redirige a `/tabs/encuestas` tras autenticación exitosa

### 🎮 Videojuegos (`/tabs/videojuegos`)
- Lista de videojuegos en tarjetas con imagen, plataforma, precio y stock
- Botón flotante (+) para agregar nuevo juego
- Acciones de **Editar** y **Eliminar** por tarjeta
- Estado vacío con mensaje orientativo

### 👥 Registros (`/tabs/registros`)
- Lista de personas entrevistadas con foto de evidencia
- Skeleton loaders durante la carga
- Confirmación antes de eliminar
- Contador de entrevistas realizadas

### 📋 Encuestas (`/tabs/encuestas`)
- Lista de encuestas con estadísticas (total, juegos únicos, con foto)
- Tarjetas con imagen de evidencia o imagen de API como fallback
- Visualización de coordenadas GPS
- Datos de API (rating, género)
- Botón de cierre de sesión en la barra superior

### 📝 Formulario de encuesta (`/encuesta-form`)
El formulario está dividido en 5 secciones:

| Sección | Campos |
|---|---|
| **1. Datos personales** | Alias, rango de edad, rol en campus |
| **2. Preferencias gamer** | Videojuego favorito, plataforma, género, comentario |
| **3. Ubicación GPS** | Lugar del campus (selector), captura automática de coordenadas |
| **4. Evidencia fotográfica** | Cámara o galería, preview de la imagen |
| **5. Info del juego (API)** | Búsqueda automática en RAWG → FreeToGame → CheapShark |

### 🚀 Promoción (`/tabs/promo`)
- Información de la app para compartir
- Imagen QR para descarga del APK
- Botones de **Compartir enlace** (nativo) y **Copiar enlace**

---

## 🌐 APIs externas integradas

El servicio `EncuestasService.buscarJuego()` implementa un sistema de fallback en cascada:

```
1. RAWG.io (requiere API key gratuita)
        ↓ si no encuentra resultado
2. FreeToGame (sin key — filtra lista completa por nombre)
        ↓ si no encuentra resultado
3. CheapShark / Steam (sin key — busca juegos de PC)
        ↓ si falla
4. Retorna null (el usuario puede continuar igual)
```

Para activar RAWG, registra una cuenta gratuita en [rawg.io/apidocs](https://rawg.io/apidocs) y agrega tu key en `environment.ts`.

---

## 📊 Dashboard web

Ubicado en `dashboard/index.html`, es una página HTML estática desplegada en Firebase Hosting que:

- Se conecta directamente a Supabase con la key anon
- **Auto-refresca cada 30 segundos**
- Muestra **5 KPIs**: Total encuestas, Juegos únicos, Con foto, Con GPS, Hoy
- **4 gráficos** con Chart.js: Por género, Por rol, Por plataforma, Por lugar
- **Top 5** videojuegos más mencionados
- **Tabla** con los últimos 50 registros (foto, alias, rol, juego, plataforma, GPS, fecha)
- Alerta visible si RLS bloquea la lectura pública

### Desplegar el dashboard

```bash
# Instalar Firebase CLI si no lo tienes
npm install -g firebase-tools

# Login en Firebase
firebase login

# Desplegar solo el dashboard
firebase deploy --only hosting
```

---

## 📦 Compilación y despliegue

### Build web/PWA

```bash
ionic build --prod
```

Los archivos se generan en `www/`.

### Sincronizar con Android

```bash
npx cap sync android
```

### Abrir en Android Studio

```bash
npx cap open android
```

---

## 📱 APK Android

### Generar APK de debug

1. Abre el proyecto en Android Studio (`npx cap open android`)
2. Ve a **Build → Build Bundle(s) / APK(s) → Build APK(s)**
3. El APK se genera en `android/app/build/outputs/apk/debug/app-debug.apk`

### Configuración del proyecto Android

| Parámetro | Valor |
|---|---|
| `applicationId` | `io.ionic.starter` |
| `minSdkVersion` | 24 (Android 7.0) |
| `targetSdkVersion` | 36 |
| `compileSdkVersion` | 36 |
| Gradle | 8.14.3 |
| Java | 21 |

### Permisos declarados

- `INTERNET`
- `CAMERA`
- `READ_EXTERNAL_STORAGE` (Android ≤ 12)
- `WRITE_EXTERNAL_STORAGE` (Android ≤ 9)
- `READ_MEDIA_IMAGES` (Android 13+)
- `READ_MEDIA_VIDEO` (Android 13+)

### Actualizar el enlace de descarga

En `src/app/pages/promo/promo.page.ts`, reemplaza el valor de `enlaceDescarga`:

```typescript
readonly enlaceDescarga =
  'https://github.com/TU-USUARIO/TU-REPO/releases/download/v1.0/app-debug.apk';
```

---

## 👤 Autor

Desarrollado como proyecto universitario con Ionic + Angular + Supabase.

---

*GameCampus © 2025 — Ionic · Supabase · Firebase Hosting*
