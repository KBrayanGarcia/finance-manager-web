# AGENTS.md

## 1. Resumen del Proyecto
Cliente web para la administración de finanzas personales (**Finance Manager Web**), desarrollado con React 19, TypeScript, Vite y TanStack Router (enrutamiento basado en archivos). Consume la API REST de `finance-manager-api`.

### Arquitectura y Módulos (`src/`):
- `features/<feature>/`: Lógica de dominio por entidad (`auth`, `accounts`, `categories`, `transactions`).
  - `<feature>.api.ts`: Contratos HTTP con Axios.
  - `use-<feature>.ts`: Hooks de fetching y mutaciones con TanStack Query v5.
- `components/ui/`: Primitivas de UI accesibles (Radix UI + Tailwind + CVA + Lucide Icons).
- `components/layout/`: Contenedores principales (`Sidebar`, `Navbar`, `PageContainer`).
- `routes/`: Enrutamiento basado en archivos con TanStack Router. El árbol compilado es `src/routeTree.gen.ts`.
- `store/`: Estado global de cliente con Zustand (ej. tokens y sesión en `auth-store.ts`).
- `lib/`: Instancias compartidas (`axios-client.ts`, función `cn`).
- `types/`: Tipos compartidos y contratos globales.

---

## 2. Comandos de Compilación y Desarrollo

```bash
# Iniciar servidor de desarrollo (Vite)
npm run dev

# Verificación de tipos y build de producción
npm run build

# Previsualizar el build generado
npm run preview

# Linting rápido con Oxlint
npm run lint
```

---

## 3. Directrices de Estilo de Código

- **Idioma:**
  - Código, variables, funciones, hooks y tipos siempre en **inglés**.
  - Textos de interfaz (UI), mensajes de error/éxito, validaciones de formularios y toasts (`sonner`) siempre en **español**.
- **Gestión de Estado:**
  - **Server State:** Usar exclusivamente **TanStack Query** (`@tanstack/react-query`). Query keys centralizadas y manejo explícito de `isLoading`/`isPending`.
  - **Client State:** Usar **Zustand** únicamente cuando el estado deba compartirse entre componentes no emparentados y no provenga del servidor.
- **Formularios:** React Hook Form tipado con validación mediante esquemas de Zod (`@hookform/resolvers/zod`).
- **Enrutamiento:**
  - No escribir lógica pesada de fetching dentro de los archivos de `src/routes/`; delegar a hooks de `features/` o loaders dedicados.
  - Preservar tipado estricto en loaders, `useParams` y `useSearch`.
- **Estilos:** Tailwind CSS utilizando la utilidad `cn` (`clsx` + `tailwind-merge`) para mezclar clases condicionales.

---

## 4. Instrucciones de Prueba y Verificación

- **Verificación de Tipos:** Ejecutar `npx tsc --noEmit` antes de dar por completada cualquier modificación para garantizar tipado estricto.
- **Validación de Enrutamiento:** Tras modificar archivos en `src/routes/`, comprobar que `src/routeTree.gen.ts` se regenere sin inconsistencias ni referencias rotas.
- **Consistencia Visual:** Verificar que los nuevos componentes mantengan los estados de foco, hover y accesibilidad definidos en las primitivas de `src/components/ui/`.

---

## 5. Consideraciones de Seguridad

- **Manejo de Credenciales:** Nunca incluir secretos, claves privadas ni tokens quemados (hardcodeados) en el código.
- **Autenticación:** Las peticiones autenticadas deben inyectar el Bearer Token automáticamente a través del interceptor de `src/lib/axios-client.ts`.
- **Rutas Protegidas:** Toda vista que requiera sesión debe residir bajo el layout autenticado `src/routes/_authenticated.tsx`.
- **Validación de Entradas:** Toda entrada del usuario debe ser sanitizada y validada en el cliente con Zod antes de enviarse al backend.

---

## 6. Flujo de Ramas, Versionado y Despliegue (CI/CD)

- **Ramas de Trabajo:**
  - **`develop`:** Rama activa de desarrollo e integración (*Staging / Preview*). Todo cambio nuevo debe commitearse en `develop` (nunca directamente en `main`).
  - **`main`:** Rama de producción protegida en GitHub. Solo recibe cambios mediante Pull Request desde `develop` (asegurando que los cambios requeridos en `finance-manager-api` se desplieguen primero).
- **Conventional Commits Obligatorios:**
  - Usar siempre prefijos semánticos (`feat:`, `fix:`, `chore:`, `ci:`, `docs:`, `refactor:`) ya que determinan el cálculo automático de versión (`SemVer`) y las notas de lanzamiento.
- **Corte de Versión y `CHANGELOG.md` Automático:**
  - No ejecutar `npm run release` manualmente antes de fusionar a `main` (para previsualizar cambios usar `npm run release:dry`).
  - Al fusionar un Pull Request de `develop` → `main`, el workflow `.github/workflows/release.yml` incrementa la versión en `package.json`, actualiza `CHANGELOG.md`, crea el tag `vX.Y.Z`, publica el GitHub Release y sincroniza el commit de regreso a `develop`.
  - Tras cada pase a producción, ejecutar `git pull --tags origin develop` y `git fetch origin main:main` para sincronizar el entorno local.
