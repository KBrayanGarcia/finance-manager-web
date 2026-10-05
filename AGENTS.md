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
