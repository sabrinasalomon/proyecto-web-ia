# Explorador Rick and Morty — proyecto-web-ia

Aplicación web que consulta personajes reales de la [Rick and Morty API](https://rickandmortyapi.com/documentation), permite buscarlos, filtrarlos y guardar favoritos.

🔗 **Aplicación publicada:** https://sabrinasalomon.github.io/proyecto-web-ia/
🔗 **Repositorio:** https://github.com/sabrinasalomon/proyecto-web-ia

## Integrantes

| Nombre | Usuario de GitHub | Aportes principales |
|---|---|---|
| Sabrina Viviana Salomón Bolaños | @sabrinasalomon | Estructura HTML, estilos CSS, README |
| Santiago Nicolás De la Mora Núñez | @USUARIO_SANTIAGO | Conexión con la API (fetch), buscador, filtros, favoritos, diseño para celulares y modo oscuro (PR) |

## Descripción

La página usa `fetch()` para pedir personajes a la API y los muestra en tarjetas con imagen, nombre, estado, especie, género, origen y ubicación (20 por página).

Funcionalidades:

- **Buscador** por nombre.
- **Filtros** por estado (vivo, muerto, desconocido), género y especie.
- **Paginación** para recorrer todos los personajes.
- **Favoritos** guardados en `localStorage` (se mantienen al recargar la página).
- **Mensajes** cuando no hay resultados o cuando la API no responde.
- **Diseño adaptable** a celulares y computadoras.
- **Mejora extra:** modo oscuro y claro (agregado con un Pull Request).

## Instrucciones de uso

1. Abre la aplicación publicada en GitHub Pages.
2. Escribe un nombre (por ejemplo, "Rick") y presiona **Buscar**.
3. Usa los menús de **Estado**, **Género** y **Especie** para filtrar. El botón **Limpiar** quita todos los filtros.
4. Usa **Anterior / Siguiente** para cambiar de página.
5. Presiona **☆ Agregar a favoritos** en una tarjeta. Revisa la pestaña **Favoritos**.
6. Usa el botón 🌙 / ☀️ del encabezado para cambiar entre modo oscuro y claro.

## Archivos

| Archivo | Función |
|---|---|
| `index.html` | Estructura de la página: buscador, filtros, pestañas y contenedores. |
| `style.css` | Colores, tarjetas, cuadrícula y adaptación a celulares (`@media`). |
| `script.js` | Lógica: `fetch()` a la API, buscador, filtros, favoritos y mensajes. |

## Uso de inteligencia artificial

### Tres prompts importantes

1. > "Crea una página con HTML, CSS y JavaScript que use fetch() para consultar la Rick and Morty API y muestre los personajes en tarjetas con imagen y descripción, con un buscador por nombre y filtros por estado, género y especie."
2. > "Agrega una sección de favoritos que se guarde con localStorage para que no se pierda al recargar la página."
3. > "¿Cómo muestro un mensaje cuando la búsqueda no tiene resultados y otro distinto cuando falla la conexión con la API?"

### Una respuesta de la IA que requirió correcciones

<!-- Ajusten este ejemplo a lo que les haya pasado a ustedes -->
La primera versión de la función `refrescarBotonesFavorito()` identificaba cada tarjeta comparando el **nombre y la imagen** del personaje. Eso podía fallar porque varios personajes comparten nombre (hay muchos "Rick Sanchez"). Lo corregimos guardando el `id` del personaje en la tarjeta con `tarjeta.dataset.id` y comparando por `id`, que es único.

### Un error encontrado y cómo lo resolvimos

Al buscar un nombre que no existe (por ejemplo "zzzz"), la API responde con **código 404** en lugar de una lista vacía, y la página mostraba el mensaje de "error de conexión". Lo resolvimos revisando `respuesta.status === 404` antes de leer los datos, para mostrar el mensaje "No se encontraron personajes" en vez de un error.

### Una modificación al código que podemos explicar

<!-- Expliquen con sus palabras la modificación que hicieron -->
Agregamos el **modo oscuro**: un botón en el encabezado agrega o quita la clase `oscuro` en el `<body>`. En `style.css` la clase `body.oscuro` cambia los valores de las variables de color (`--fondo`, `--tarjeta`, `--texto`...), por eso toda la página cambia de color sin reescribir cada regla. La preferencia se guarda en `localStorage` con la clave `tema`, así se recuerda al volver a abrir la página.

### Reflexión sobre lo que aprendimos usando IA

<!-- Escriban su propia reflexión -->
La IA nos ayudó a avanzar rápido con la estructura del código, pero aprendimos que no siempre acierta: tuvimos que probar cada función, leer la documentación de la API y corregir casos que la IA no consideró. También aprendimos que para poder explicar el proyecto es necesario entender cada línea, no solo copiar el código.

## Dificultades

- Entender que la API devuelve 404 cuando no hay resultados.
- Mantener sincronizados los botones de favoritos entre la pestaña de resultados y la de favoritos.
- Trabajar solo desde el editor web de GitHub, sin poder probar el código antes de hacer commit.
