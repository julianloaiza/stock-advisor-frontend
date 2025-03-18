# Stock Advisor

Stock Advisor es una aplicación web moderna diseñada para visualizar, filtrar y analizar datos del mercado bursátil. La aplicación proporciona una interfaz intuitiva para que los usuarios busquen, filtren y obtengan recomendaciones sobre potenciales oportunidades de inversión.

![Escritorio/Celular Modo Oscuro/Claro](src/assets/captures/capture.png)

## Características

- **Filtrado Avanzado de Acciones**: Busca y filtra acciones por ticker, empresa, rango de precios y más
- **Algoritmo de Recomendación**: Análisis inteligente de calificaciones y precios objetivo
- **Diseño Responsivo**: Interfaz completamente adaptable que funciona en móviles, tablets y escritorio
- **Sincronización de Datos en Tiempo Real**: Actualiza la información bursátil desde fuentes externas
- **Soporte Multilenguaje**: Disponible en inglés y español
- **Modo Claro/Oscuro**: Se adapta automáticamente a las preferencias del sistema
- **UI/UX Moderno**: Interfaz limpia e intuitiva con estilos de Tailwind CSS y componentes de Flowbite

## Requisitos

- Node.js 22.0+ (recomendado)
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Backend API (ver repositorio correspondiente del backend)

## Instalación

Clona el repositorio e instala las dependencias:

```bash
# Clonar el repositorio
git clone git@github.com:julianloaiza/stock-advisor-frontend.git
cd stock-advisor

# Instalar dependencias
npm install

# Crear archivo .env desde el ejemplo
cp .env.example .env
```

Configura tus variables de entorno en el archivo `.env`:

```
VITE_API_BASE_URL=http://localhost:8080
VITE_DEFAULT_LANGUAGE=ES
```

> Nota: VITE_DEFAULT_LANGUAGE puede configurarse como 'EN' o 'ES' para definir el idioma predeterminado de la aplicación cuando no existe una preferencia de usuario.

## Desarrollo

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Ejecuta las pruebas unitarias:

```bash
npm run test:unit
```

Formatea y revisa tu código:

```bash
# Corregir problemas de linting
npm run lint

# Formatear código con Prettier
npm run format
```

Verificar tipos del proyecto:

```bash
npm run type-check
```

## Arquitectura

La aplicación sigue el patrón de Diseño Atómico, organizado con una clara separación de responsabilidades:

### Componentes Principales de la Arquitectura

- **API**: Configuración y servicios para comunicación con el backend
- **Assets**: Recursos estáticos como imágenes, iconos y estilos globales
- **Components**: Elementos de UI siguiendo la metodología de Diseño Atómico
  - **Atoms**: Bloques básicos como botones, inputs y alertas
  - **Layout**: Componentes estructurales para organización de páginas
  - **Molecules**: Grupos de átomos formando componentes más complejos
  - **Organisms**: Grupos complejos de componentes como tablas de datos y sistemas de filtrado
- **Composables**: Lógica reutilizable con Vue Composition API
- **Config**: Configuraciones y constantes de la aplicación
- **i18n**: Soporte de internacionalización para múltiples idiomas
- **Interfaces**: Tipos e interfaces de TypeScript para tipado fuerte
- **Router**: Configuración de navegación con Vue Router
- **Stores**: Gestión de estado centralizada con Pinia (incluye persistencia)
- **Utils**: Funciones de utilidad para operaciones comunes
- **Views**: Páginas/pantallas principales de la aplicación

### Componentes Clave

- **Átomos**: Elementos básicos de UI como botones, inputs y alertas
- **Moléculas**: Componentes de formulario, modales y sistemas de notificación
- **Organismos**: Componentes avanzados como tablas de datos y sistemas de filtrado
- **Composables**: Lógica reutilizable extraída con Vue Composition API
- **Stores**: Gestión de estado centralizada con Pinia (incluye persistencia)
- **TypeScript**: Código seguro de tipos en toda la aplicación

### Estructura Detallada del Proyecto

```
├── .env                         # Variables de entorno
├── package.json                 # Dependencias y scripts del proyecto
├── tsconfig.json                # Configuración de TypeScript
├── vite.config.ts               # Configuración de compilación de Vite
├── index.html                   # Punto de entrada HTML principal
└── src
    ├── App.vue                  # Componente raíz
    ├── main.ts                  # Punto de entrada de la aplicación
    ├── api
    │   ├── axios.ts             # Configuración del cliente HTTP Axios
    │   └── services
    │       └── stockService.ts  # Servicio de API para acciones
    ├── assets
    │   ├── icons
    │   │   └── logo.svg         # Logo de la aplicación
    │   └── styles
    │       └── main.css         # Estilos globales
    ├── components
    │   ├── atoms
    │   │   ├── AlertBanner.vue  # Componente de alerta
    │   │   ├── BaseButton.vue   # Componente de botón
    │   │   ├── BaseDropdown.vue # Componente desplegable
    │   │   ├── BaseInput.vue    # Componente de campo de entrada
    │   │   ├── BaseSwitch.vue   # Componente de interruptor
    │   │   ├── ErrorMessage.vue # Componente de mensaje de error
    │   │   ├── InfoPanel.vue    # Componente de panel informativo
    │   │   ├── LoadingIndicator.vue # Componente de indicador de carga
    │   │   └── NotificationItem.vue # Componente de elemento de notificación
    │   ├── layout
    │   │   ├── AppContent.vue   # Contenedor principal de contenido
    │   │   ├── AppFooter.vue    # Componente de pie de página
    │   │   └── AppNavBar.vue    # Componente de barra de navegación
    │   ├── molecules
    │   │   ├── ConfirmationModal.vue # Componente de diálogo de confirmación
    │   │   ├── CustomForm.vue   # Componente genérico de formulario
    │   │   ├── CustomTable
    │   │   │   ├── TableHeader.vue    # Componente de encabezado de tabla
    │   │   │   ├── TablePagination.vue # Componente de paginación de tabla
    │   │   │   └── TableState.vue     # Componente de estado de tabla
    │   │   ├── LanguageSwitcher.vue   # Componente de selector de idioma
    │   │   └── NotificationDropdown.vue # Componente desplegable de notificaciones
    │   └── organisms
    │       ├── CustomFilter.vue # Componente de filtrado avanzado
    │       └── CustomTable.vue  # Componente de tabla de datos
    ├── composables
    │   ├── useCustomForm.ts     # Composable de lógica de formulario
    │   ├── useCustomTable.ts    # Composable de lógica de tabla
    │   ├── useStocks.ts         # Composable de datos de acciones
    │   └── useSync.ts           # Composable de sincronización de datos
    ├── config
    │   ├── constants.ts         # Constantes de la aplicación
    │   ├── stocksConfig.ts      # Configuración del módulo de acciones
    │   └── syncConfig.ts        # Configuración del módulo de sincronización
    ├── i18n
    │   ├── index.ts             # Inicialización y configuración de i18n
    │   └── locales
    │       ├── en.json          # Traducciones en inglés
    │       └── es.json          # Traducciones en español
    ├── interfaces
    │   ├── BaseForm.interface.ts # Definiciones de interfaces de formulario
    │   ├── BaseTable.interface.ts # Definiciones de interfaces de tabla
    │   ├── Response.interface.ts # Interfaces de respuesta de API
    │   └── Stock.interface.ts   # Interfaces de datos de acciones
    ├── router
    │   └── index.ts             # Configuración de Vue Router
    ├── stores
    │   ├── languageStore.ts     # Gestión de estado de idioma
    │   ├── notificationStore.ts # Gestión de estado de notificaciones
    │   ├── stockStore.ts        # Gestión de estado de datos de acciones
    │   └── syncStore.ts         # Gestión de estado de sincronización
    ├── utils
    │   └── formatterUtils.ts    # Utilidades de formateo de datos
    └── views
        ├── NotFoundView.vue     # Página 404
        ├── StocksView.vue       # Página de listado de acciones
        └── SyncView.vue         # Página de sincronización de datos
```

### Componentes Clave

- **Átomos**: Elementos básicos de UI como botones, inputs y alertas
- **Moléculas**: Componentes de formulario, modales y sistemas de notificación
- **Organismos**: Componentes avanzados como tablas de datos y sistemas de filtrado
- **Composables**: Lógica reutilizable extraída con Vue Composition API
- **Stores**: Gestión de estado centralizada con Pinia (incluye persistencia)
- **TypeScript**: Código seguro de tipos en toda la aplicación

## Integración con Backend

La aplicación se conecta a una API backend para obtener y actualizar datos de acciones. Asegúrate de que el backend esté correctamente configurado y en funcionamiento.

Repositorio del backend: [julianloaiza/stock-advisor](https://github.com/julianloaiza/stock-advisor)

## Internacionalización

La aplicación admite múltiples idiomas. Actualmente implementados:

- Inglés (EE.UU.)
- Español (ES)

Para añadir un nuevo idioma:

1. Crea un nuevo archivo de traducción en `src/i18n/locales/`
2. Añade el idioma en el `src/i18n/index.ts/`
3. Actualiza la UI del componente `LanguageSwitcher.vue` para seleccionarlo
