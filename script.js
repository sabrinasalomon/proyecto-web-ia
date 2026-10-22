// ===== Configuración =====
const API_URL = "https://rickandmortyapi.com/api/character";
const CLAVE_FAVORITOS = "favoritosRickMorty";

// ===== Referencias a elementos del HTML =====
const formBusqueda = document.getElementById("formBusqueda");
const inputNombre = document.getElementById("inputNombre");
const filtroEstado = document.getElementById("filtroEstado");
const filtroGenero = document.getElementById("filtroGenero");
const filtroEspecie = document.getElementById("filtroEspecie");
const btnLimpiar = document.getElementById("btnLimpiar");

const listaPersonajes = document.getElementById("listaPersonajes");
const listaFavoritos = document.getElementById("listaFavoritos");
const mensaje = document.getElementById("mensaje");

const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");
const infoPagina = document.getElementById("infoPagina");

const tabResultados = document.getElementById("tabResultados");
const tabFavoritos = document.getElementById("tabFavoritos");
const seccionResultados = document.getElementById("seccionResultados");
const seccionFavoritos = document.getElementById("seccionFavoritos");
const contadorFavoritos = document.getElementById("contadorFavoritos");

// ===== Estado de la aplicación =====
let paginaActual = 1;
let totalPaginas = 1;
let favoritos = cargarFavoritos();

// Traducciones para mostrar los datos en español
const TRADUCCIONES = {
  Alive: "Vivo",
  Dead: "Muerto",
  unknown: "Desconocido",
  Female: "Femenino",
  Male: "Masculino",
  Genderless: "Sin género",
  Human: "Humano",
  Alien: "Alien",
  Humanoid: "Humanoide",
  Robot: "Robot",
  Animal: "Animal",
};

function traducir(texto) {
  return TRADUCCIONES[texto] || texto;
}

// ===== Consulta a la API con fetch() =====
async function buscarPersonajes() {
  // Armamos la URL con la página, el nombre y los filtros elegidos
  const parametros = new URLSearchParams({ page: paginaActual });
  if (inputNombre.value.trim()) parametros.append("name", inputNombre.value.trim());
  if (filtroEstado.value) parametros.append("status", filtroEstado.value);
  if (filtroGenero.value) parametros.append("gender", filtroGenero.value);
  if (filtroEspecie.value) parametros.append("species", filtroEspecie.value);

  mostrarMensaje("Cargando personajes...");
  listaPersonajes.innerHTML = "";

  try {
    const respuesta = await fetch(`${API_URL}?${parametros}`);

    // La API responde 404 cuando no encuentra personajes con esos filtros
    if (respuesta.status === 404) {
      totalPaginas = 1;
      actualizarPaginacion();
      mostrarMensaje("No se encontraron personajes con esa búsqueda. Prueba con otro nombre o filtro.");
      return;
    }

    if (!respuesta.ok) {
      throw new Error(`Error del servidor: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    totalPaginas = datos.info.pages;
    ocultarMensaje();
    mostrarPersonajes(datos.results, listaPersonajes);
    actualizarPaginacion();
  } catch (error) {
    // Entra aquí si no hay internet o la API no responde
    console.error(error);
    totalPaginas = 1;
    actualizarPaginacion();
    mostrarMensaje("No se pudo conectar con la API. Revisa tu conexión e inténtalo de nuevo.", true);
  }
}

// ===== Mostrar tarjetas =====
function mostrarPersonajes(personajes, contenedor) {
  contenedor.innerHTML = "";

  personajes.forEach((personaje) => {
    const esFavorito = favoritos.some((fav) => fav.id === personaje.id);

    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";
    tarjeta.dataset.id = personaje.id; // guardamos el id para identificar la tarjeta
    tarjeta.innerHTML = `
      <img src="${personaje.image}" alt="${personaje.name}" loading="lazy">
      <div class="tarjeta-cuerpo">
        <h3>${personaje.name}</h3>
        <span class="estado ${personaje.status.toLowerCase()}">${traducir(personaje.status)}</span>
        <p><strong>Especie:</strong> ${traducir(personaje.species)}</p>
        <p><strong>Género:</strong> ${traducir(personaje.gender)}</p>
        <p><strong>Origen:</strong> ${personaje.origin.name}</p>
        <p><strong>Ubicación:</strong> ${personaje.location.name}</p>
        <button type="button" class="btn-favorito ${esFavorito ? "activo" : ""}">
          ${esFavorito ? "★ En favoritos" : "☆ Agregar a favoritos"}
        </button>
      </div>
    `;

    tarjeta.querySelector(".btn-favorito").addEventListener("click", () => {
      alternarFavorito(personaje);
    });

    contenedor.appendChild(tarjeta);
  });
}

// ===== Favoritos con localStorage =====
function cargarFavoritos() {
  const guardados = localStorage.getItem(CLAVE_FAVORITOS);
  return guardados ? JSON.parse(guardados) : [];
}

function guardarFavoritos() {
  localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
}

function alternarFavorito(personaje) {
  const yaExiste = favoritos.some((fav) => fav.id === personaje.id);

  if (yaExiste) {
    favoritos = favoritos.filter((fav) => fav.id !== personaje.id);
  } else {
    favoritos.push(personaje);
  }

  guardarFavoritos();
  actualizarContador();
  refrescarBotonesFavorito();
  mostrarFavoritos();
}

// Actualiza los botones de las tarjetas visibles sin volver a llamar a la API
function refrescarBotonesFavorito() {
  listaPersonajes.querySelectorAll(".tarjeta").forEach((tarjeta) => {
    const id = Number(tarjeta.dataset.id);
    const boton = tarjeta.querySelector(".btn-favorito");
    const esFavorito = favoritos.some((fav) => fav.id === id);
    boton.classList.toggle("activo", esFavorito);
    boton.textContent = esFavorito ? "★ En favoritos" : "☆ Agregar a favoritos";
  });
}

function mostrarFavoritos() {
  if (favoritos.length === 0) {
    listaFavoritos.innerHTML = '<p class="mensaje">Todavía no tienes favoritos. Agrega personajes desde la pestaña Resultados.</p>';
    return;
  }
  mostrarPersonajes(favoritos, listaFavoritos);
}

function actualizarContador() {
  contadorFavoritos.textContent = favoritos.length;
}

// ===== Mensajes =====
function mostrarMensaje(texto, esError = false) {
  mensaje.textContent = texto;
  mensaje.classList.remove("oculto");
  mensaje.classList.toggle("error", esError);
}

function ocultarMensaje() {
  mensaje.classList.add("oculto");
}

// ===== Paginación =====
function actualizarPaginacion() {
  infoPagina.textContent = `Página ${paginaActual} de ${totalPaginas}`;
  btnAnterior.disabled = paginaActual <= 1;
  btnSiguiente.disabled = paginaActual >= totalPaginas;
}

btnAnterior.addEventListener("click", () => {
  paginaActual--;
  buscarPersonajes();
});

btnSiguiente.addEventListener("click", () => {
  paginaActual++;
  buscarPersonajes();
});

// ===== Buscador y filtros =====
function nuevaBusqueda() {
  paginaActual = 1;
  cambiarPestana("resultados");
  buscarPersonajes();
}

formBusqueda.addEventListener("submit", (evento) => {
  evento.preventDefault(); // evita que la página se recargue
  nuevaBusqueda();
});

filtroEstado.addEventListener("change", nuevaBusqueda);
filtroGenero.addEventListener("change", nuevaBusqueda);
filtroEspecie.addEventListener("change", nuevaBusqueda);

btnLimpiar.addEventListener("click", () => {
  inputNombre.value = "";
  filtroEstado.value = "";
  filtroGenero.value = "";
  filtroEspecie.value = "";
  nuevaBusqueda();
});

// ===== Pestañas =====
function cambiarPestana(pestana) {
  const verFavoritos = pestana === "favoritos";
  seccionResultados.classList.toggle("oculto", verFavoritos);
  seccionFavoritos.classList.toggle("oculto", !verFavoritos);
  tabResultados.classList.toggle("activa", !verFavoritos);
  tabFavoritos.classList.toggle("activa", verFavoritos);

  if (verFavoritos) {
    ocultarMensaje();
    mostrarFavoritos();
  }
}

tabResultados.addEventListener("click", () => {
  cambiarPestana("resultados");
  buscarPersonajes();
});

tabFavoritos.addEventListener("click", () => cambiarPestana("favoritos"));

// ===== Inicio =====
actualizarContador();
buscarPersonajes();