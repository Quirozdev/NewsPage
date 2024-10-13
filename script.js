const formulario = document.querySelector("form");
const inputBusqueda = document.querySelector("#busqueda");
const contenedorNoticias = document.querySelector("#contenedor-noticias");

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();
  limpiarSeccionNoticias();
  const busqueda = inputBusqueda.value;
  try {
    mostrarCargando();
    const noticias = await obtenerNoticias(busqueda);
    limpiarSeccionNoticias();
    crearElementosNoticias(noticias);
  } catch (error) {
    limpiarSeccionNoticias();
    mostrarMensajeError(error.message);
  }
});

async function obtenerNoticias(query) {
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&language=es&apiKey=c6932b2e4dc84a35ba09b3bd30c6788d`
  );
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("Por favor, ingresa una búsqueda válida");
    } else {
      throw new Error("Algo salió mal, vuelve a intentarlo");
    }
  }
  const datos = await response.json();
  return datos.articles;
}

function limpiarSeccionNoticias() {
  contenedorNoticias.textContent = "";
}

function crearElementosNoticias(noticias) {
  if (noticias.length === 0) {
    mostrarMensajeError("No se encontraron noticias para esa búsqueda");
  }
  noticias.forEach((noticia) => {
    // elementos del DOM creandose dinamicamente
    const link = document.createElement("a");
    link.href = noticia.url;
    link.classList.add("url-articulo");
    link.target = "_blank";

    const article = document.createElement("article");
    article.classList.add("noticia");

    const img = document.createElement("img");

    const contenedorInformacionArticulo = document.createElement("div");
    contenedorInformacionArticulo.classList.add(
      "contenedor-informacion-articulo"
    );

    const titulo = document.createElement("p");
    titulo.classList.add("titulo");

    const autor = document.createElement("p");
    autor.classList.add("autor");

    const contenido = document.createElement("p");
    contenido.classList.add("contenido");

    // por si el articulo no tiene una url a una imagen, ponerle una por defecto
    img.src = noticia.urlToImage || "../img/imagenNoticias.png";
    titulo.textContent = noticia.title;
    autor.textContent = noticia.author;
    contenido.textContent = noticia.content;

    article.append(img);
    contenedorInformacionArticulo.append(titulo);
    contenedorInformacionArticulo.append(autor);
    contenedorInformacionArticulo.append(contenido);

    article.append(contenedorInformacionArticulo);

    link.append(article);
    contenedorNoticias.append(link);
  });
}

function mostrarCargando() {
  const div = document.createElement("div");
  div.classList.add("cargando");
  contenedorNoticias.append(div);
}

function mostrarMensajeError(mensaje) {
  const div = document.createElement("div");
  div.classList.add("contenedor-mensaje-error");
  const p = document.createElement("p");
  p.textContent = mensaje;
  div.append(p);
  contenedorNoticias.append(div);
}
