# TeoAutomotriz

Proyecto académico de Programación Web 1: sistema demostrativo de mantenimiento automotriz con HTML5, CSS3, Bootstrap 5, JavaScript, SweetAlert2 y LocalStorage.

## Cómo abrirlo

1. Abre la carpeta `TeoAutomotriz` en Visual Studio Code.
2. Abre `index.html` en un navegador. Para el comportamiento más consistente de `localStorage`, se recomienda usar una extensión de servidor local (por ejemplo, Live Server) y abrir la dirección local que esta genere.
3. Se necesita conexión a internet para cargar Bootstrap, SweetAlert2 y la imagen de portada desde sus CDN/URL.

## Acceso

- La aplicación incluye tres usuarios de demostración y dos roles:

| Rol | Correo | Contraseña |
|---|---|---|
| Cliente | `cliente@teoautomotriz.com` | `cliente123` |
| Cliente | `ana@teoautomotriz.com` | `ana123` |
| Administrador | `admin@teoautomotriz.com` | `admin123` |

- También se puede registrar una cuenta de cliente propia. El correo debe ser único y la cuenta queda guardada en el navegador actual.

## Funcionalidades

- Página institucional con inicio, nosotros, servicios y contacto.
- Solicitud con datos del cliente, vehículo y mantenimiento.
- Validación de campos, formato, año, kilometraje y fecha y hora no pasadas.
- Registro de cuentas personales y acceso con roles de cliente y administrador.
- Consulta del perfil de la cuenta activa y rechazo de cuentas deshabilitadas.
- El cliente consulta únicamente sus solicitudes y sus estados.
- El administrador consulta todas las solicitudes, crea, edita, elimina y actualiza estados.
- Persistencia de las solicitudes en LocalStorage.
- Alertas con SweetAlert2 y diseño adaptable mediante Bootstrap.

## Casos de prueba de la consigna

1. Inicia sesión con cualquiera de las cuentas anteriores y confirma que aparece su perfil y, para clientes, solo sus solicitudes.
2. Prueba un correo o contraseña incorrectos y confirma que aparece una alerta y no se abre el panel. Las cuentas con `active: false` también se rechazan.
3. Envía una solicitud con placa, fecha, hora o kilometraje fuera de las reglas; debe mostrar el error y no guardarla.
4. Registra una solicitud válida y confirma que aparece en el panel con estado Pendiente.
5. Entra como cliente y confirma que solo aparecen sus solicitudes y que no se muestran controles para editar, eliminar o cambiar estados.
6. Entra como administrador, cambia el estado de una solicitud y elimínala; el listado general debe reflejar los cambios.

## Imágenes incluidas

La carpeta images/ contiene una ilustración local para la portada y una imagen SVG a color para cada servicio. No necesitan conexión a internet.

## Archivos

- `index.html`: contenido y formularios.
- `css/styles.css`: estilos propios.
- `js/script.js`: datos de prueba, validaciones, login, permisos y CRUD.

## Limitaciones académicas

Este proyecto no incluye servidor ni base de datos. Las cuentas y solicitudes quedan guardadas únicamente en el almacenamiento local del navegador y las contraseñas no están cifradas. En otro computador o navegador se debe crear la cuenta de nuevo. No se debe usar este mecanismo para información real o seguridad de producción: los datos y permisos pueden inspeccionarse o modificarse desde el navegador. El login es una simulación para demostrar conceptos de programación web.

## Tecnologías oficiales

- [Bootstrap 5](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [MDN: validación de formularios](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation)
- [MDN: Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)
- [SweetAlert2](https://sweetalert2.github.io/)

## Registro de uso de inteligencia artificial

Se utilizó ChatGPT/Codex como apoyo para revisar la consigna, corregir la navegación y el acceso por roles, implementar el registro y la consulta del perfil, y documentar el proyecto. El estudiante debe revisar el código, probar los flujos y poder explicar las funciones antes de entregar.

## Fuentes y recursos externos

- Bootstrap 5.3: [documentación oficial](https://getbootstrap.com/docs/5.3/) y hoja de estilos incluida desde [jsDelivr](https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css).
- SweetAlert2: [documentación oficial](https://sweetalert2.github.io/) y biblioteca incluida desde [jsDelivr](https://cdn.jsdelivr.net/npm/sweetalert2@11).
- Almacenamiento local del navegador: [MDN Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API).
- Imagen de portada: [Unsplash](https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1800&q=85).
- Fotografías de servicios: [Squarespace](https://images.squarespace-cdn.com/content/v1/66cf56b09e9f0b067cd80a96/19802a7c-9c86-4372-ada0-7a989149ba55/Untitled-1%2Bcopy.jpg?format=1500w), [Wix 1](https://static.wixstatic.com/media/11062b_57ba832f5a76408791eebce94221efbd~mv2.jpg/v1/fill/w_900%2Ch_600%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/11062b_57ba832f5a76408791eebce94221efbd~mv2.jpg), [Wix 2](https://static.wixstatic.com/media/11062b_a9c4f4f1e3c64af083c01811a62930e7~mv2.jpg/v1/fill/w_640%2Ch_462%2Cal_c%2Cq_80%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/11062b_a9c4f4f1e3c64af083c01811a62930e7~mv2.jpg), [Wix 3](https://static.wixstatic.com/media/c86304_08b82cbb1c344165b48b1f7dda77c9d1~mv2.jpg/v1/fill/w_1920%2Ch_1281%2Cal_c%2Cq_90%2Cusm_0.66_1.00.01%2Cenc_avif%2Cquality_auto/c86304_08b82cbb1c344165b48b1f7dda77c9d1~mv2.jpg), [Lirp](https://lirp.cdn-website.com/4d7e77fb/dms3rep/multi/opt/auto%2Brepair%2Bmartinsville%2Bva-1920w.jpg) y [ArabWheels](https://static.arabwheels.ae/2026/06/02141511/ChatGPTImageJun2202602_11_37P-2.jpeg).


