// Variables del carrito
const totalPrecio = document.querySelector('#precio-total-carro')
const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarrito = document.querySelector("#vaciar-carrito");
let articulosCarrito = [];

// Variables lista de cursos
const listaCursos = document.querySelector("#lista-cursos");

// Cargar addEventListener
cargarAddEventListeners();

function cargarAddEventListeners(){
	// Cuando agregas un curso presionando 'Agregar al carrito'
	listaCursos.addEventListener("click", agregarCurso);

    carrito.addEventListener("click", eliminarCurso);
    vaciarCarrito.addEventListener("click", () => {
        mostrarPrecioTotal();
        articulosCarrito = [];
        console.log(articulosCarrito)
        carritoHTML();
        limpiarHTML();
        
    })

    document.addEventListener('DOMContentLoaded',() => {
        articulosCarrito = JSON.parse(localStorage.getItem('articulo')) || [];
        console.log(articulosCarrito);
        carritoHTML();
        mostrarPrecioTotal()
    })
}

// Funciones
function agregarCurso(curso){
	curso.preventDefault();
	// Verificamos si el elemento al que le damos click contiene la clase 'agregar-carrito'
	const cursoSeleccionado = curso.target.parentElement.parentElement;
	if(curso.target.classList.contains("agregar-carrito")){
		mostrarInfo(cursoSeleccionado);
	}
    mostrarPrecioTotal();
}

// Eliminamos un curso
function eliminarCurso(e) {
    if(e.target.classList.contains('borrar-curso')){
        const cursoID = e.target.getAttribute('data-id');
        // Elimina el elemento de articulosCarrito por el data-id usando filter
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoID);
        console.log(articulosCarrito);
        carritoHTML();
    }
}

function mostrarPrecioTotal(){
    const reducePrecioTotal  = articulosCarrito.reduce((acumulador, articulo) => {
        const precio = parseInt(articulo.precioCurso.replace('$', ''));
        const cantidad = articulo.cantidad;
        return acumulador + (precio * cantidad);
    }, 0)

    console.log(reducePrecioTotal)

    const precioTotalHTML = document.createElement('P');
    precioTotalHTML.classList.add('precio-total-carro');
    precioTotalHTML.textContent = `Precio total: $ ${reducePrecioTotal}`;

    totalPrecio.appendChild(precioTotalHTML);
}

// Extrae y muestra la información del curso
function mostrarInfo(curso){

	// console.log(curso)
	// Crea un objeto con el contenido del curso actual
	const infoCurso = {
		imagen: curso.querySelector("img").src,
		nombreCurso: curso.querySelector("h4").textContent,
		precioCurso: curso.querySelector(".precio span").textContent,
		id: curso.querySelector("a").getAttribute("data-id"),
		cantidad: 1
	};

    // Validamos si existe más de la cantidad de un curso
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id)

    if(existe){
        const cursos = articulosCarrito.map(curso => {
            if(curso.id === infoCurso.id){
                curso.cantidad++;
                return curso;
            }else{
                return curso;
            }
        })
        articulosCarrito = [...cursos]
    }else{
        // Agrega elementos en el carrito de compras
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

	console.log(articulosCarrito);
    carritoHTML();

}


// Muestra el carrito de compras en el HTML
function carritoHTML () {

    // Limpia el HTML
    limpiarHTML();

    // Recorre el carrito y genera el HTML
    articulosCarrito.forEach( curso => {
        const {imagen, nombreCurso, precioCurso, cantidad, id} = curso;

        const row = document.createElement('tr')
        row.innerHTML = `
            <td><img src="${imagen}" width=100></td>
            <td>${nombreCurso}</td>
            <td>$ ${precioCurso.replace('$','')}</td>
            <td>${cantidad}</td>
            <td> 
                <a href="#" class="borrar-curso" data-id="${id}"> X </a>
            </td>
        `;
        // Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row); 

    })

    saveAtLocalStorage();

}


function limpiarHTML(){
    // Forma lenta
    // contenedorCarrito.innerHTML = '';

    // Forma eficiente de renderizar sin que se dupliquen los elementos del primer renderizado.
    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }

    while(totalPrecio.firstChild){
        totalPrecio.removeChild(totalPrecio.firstChild);
    }

}

function saveAtLocalStorage(){
    // Guardamos los elementos del objeto articulosCarrito en el localStorage    
    localStorage.setItem('articulo', JSON.stringify(articulosCarrito));
}






