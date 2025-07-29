# Gestión de Riesgos WebApp

Esta aplicación permite la gestión integral de riesgos de seguridad de la información, incluyendo valoración de activos, identificación y tratamiento de riesgos, observaciones, y generación de reportes. Desarrollada en React + Vite, con integración a Firebase y notificaciones por correo.

## Estructura de Componentes (Pages)

- **Login.jsx**: Página de inicio de sesión de usuarios registrados. Utiliza Firebase Auth y muestra alertas con SweetAlert2.
- **Register.jsx**: Registro de nuevos usuarios. Valida correo y contraseña, y muestra alertas de éxito/error.
- **Dashboard.jsx**: Layout principal tras autenticación. Incluye navegación lateral a todos los módulos y botón de cierre de sesión.
- **Inicio.jsx**: Página de inicio del dashboard. Muestra gráficos de riesgos y estrategias, y permite descargar un reporte PDF.
- **ValoracionActivos.jsx**: Permite registrar y listar activos, asignarles valores de confidencialidad, integridad y disponibilidad. Incluye paginación y alertas.
- **IdentificacionRiesgos.jsx**: Registro y listado de riesgos asociados a activos. Ofrece sugerencias automáticas de vulnerabilidades y controles según el tipo/categoría de activo. Incluye paginación y alertas.
- **TratamientoRiesgos.jsx**: Permite definir estrategias y controles para riesgos identificados, asignar responsable (correo) y enviar notificación automática por EmailJS. El selector de riesgos tiene paginación.
- **ListaTratamientos.jsx**: Muestra todos los tratamientos registrados, con paginación y opción de eliminar. Alertas unificadas.
- **Observaciones.jsx**: Permite registrar observaciones/recomendaciones sobre riesgos y ver el historial paginado. El listado se actualiza automáticamente tras cada registro.

## Instalación y uso

1. Clona el repositorio y ejecuta `npm install`.
2. Configura tus credenciales de Firebase y EmailJS en los archivos indicados.
3. Ejecuta `npm run dev` para desarrollo local.

## Notas

- Todas las páginas principales usan SweetAlert2 para alertas.
- Los listados principales tienen paginación (5 elementos por página).
- El código está comentado para facilitar su revisión y mantenimiento.

# React + Vite

Este template proporciona una configuración mínima para hacer funcionar React en Vite con HMR y algunas reglas de ESLint.

Actualmente, hay dos plugins oficiales disponibles:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) usa [Babel](https://babeljs.io/) para Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) usa [SWC](https://swc.rs/) para Fast Refresh

## Ampliando la configuración de ESLint

Si estás desarrollando una aplicación para producción, se recomienda usar TypeScript con reglas de linting conscientes del tipo habilitadas. Consulta la [plantilla TS](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) para obtener información sobre cómo integrar TypeScript y [`typescript-eslint`](https://typescript-eslint.io) en tu proyecto.
