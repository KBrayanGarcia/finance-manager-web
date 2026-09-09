# Finance Manager Web 💳

Frontend web moderno para la administración de finanzas personales, desarrollado con **React**, **TypeScript**, **Vite** y **TanStack Router** con enrutamiento basado en archivos (File-Based Routing).

Este cliente consume la API REST de [finance-manager-api](https://github.com/KBrayanGarcia/finance-manager-api).

---

## 🛠️ Stack Tecnológico

- **Framework & Build**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vite.dev/)
- **Enrutamiento**: [TanStack Router](https://tanstack.com/router) (File-Based Routing con `@tanstack/router-plugin/vite`)
- **Manejo de Estado**:
  - [Zustand](https://zustand-demo.pmnd.rs/) con persistencia en `localStorage` (sesión y tokens JWT)
  - [TanStack React Query v5](https://tanstack.com/query) (caché, reintentos y mutaciones)
- **Networking**: [Axios](https://axios-http.com/) con interceptores para inyección automática de Bearer Token
- **Estilos & UI**:
  - [TailwindCSS](https://tailwindcss.com/)
  - Componentes accesibles estilo [Shadcn / Radix UI](https://ui.shadcn.com/) (`Button`, `Card`, `Dialog`, `Input`, `Select`, `Table`, `Badge`)
  - [Lucide React](https://lucide.dev/) (íconos)
- **Formularios & Validación**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Fechas**: [date-fns](https://date-fns.org/)

---

## 📁 Estructura del Proyecto

```text
src/
├── routeTree.gen.ts      # Árbol de rutas autogenerado
├── routes/               # File-Based Routing
│   ├── __root.tsx        # Raíz con Outlet
│   ├── login.tsx         # /login (Inicio de sesión)
│   ├── register.tsx      # /register (Registro)
│   └── _authenticated.tsx # Layout protegido con Sidebar y Navbar
│       ├── index.tsx     # / (Dashboard principal con balances)
│       ├── accounts.tsx  # /accounts (Gestión de cuentas)
│       ├── categories.tsx# /categories (Gestión de categorías)
│       ├── transactions.tsx # /transactions (Historial y movimientos)
│       └── profile.tsx   # /profile (Datos del usuario)
├── components/
│   ├── ui/               # Primitivas de UI (Button, Card, Input, Dialog, etc.)
│   └── layout/           # Sidebar, Navbar, PageContainer
├── features/             # Servicios y hooks de React Query por dominio
│   ├── auth/
│   ├── accounts/
│   ├── categories/
│   └── transactions/
├── lib/
│   ├── axios-client.ts   # Instancia Axios con interceptores
│   └── utils.ts          # Helper cn()
├── store/
│   └── auth-store.ts     # Store global de sesión con Zustand
└── types/                # Definiciones de tipos TypeScript
```

---

## 🚀 Instalación y Ejecución

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Variables de Entorno** (Opcional, por defecto apunta a `http://localhost:3000/api/v1`):
   Crea un archivo `.env`:
   ```env
   VITE_API_URL=http://localhost:3000/api/v1
   ```

3. **Iniciar en modo desarrollo**:
   ```bash
   npm run dev
   ```

4. **Compilar para producción**:
   ```bash
   npm run build
   ```

---

## 🔗 Repositorios Relacionados

- **Backend API**: [KBrayanGarcia/finance-manager-api](https://github.com/KBrayanGarcia/finance-manager-api)

