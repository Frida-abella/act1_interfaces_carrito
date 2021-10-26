
var nombreArticulo;    // almacena el nombre del artículo
var precioArticulo;  // almacena el precio del artículo por unidad
var unidadesArticulo;  // almacena el número de unidades de cada artículo
var importeTotalArticulo;  // almacena el importe calculado a partir del precio del articulo multiplicado por número de unidades

var botonAñadir;  // almacenala información del botón "Añadir al carrito" 

var articulosCarrito;  // almacena el valor de todos los artículos que se han ido añadiendo al carrito
var precioTotalCarrito;  // almacena el contenido o valor de la suma de los importes de todos lso artículos

// ERRORES: Se recogen los textos que deben salir por pantalla en caso de faltar datos en las cajas de texto iniciales:
var faltaNombre;
var faltaPrecio;
var errorDato;

// Patrón para comprobar que los datos introducidos en Precio son numéricos (pueden ser decimales de varios dígitos separados por coma o punto, y positivos o negativos, esto último en caso de descuentos(?))
var datosPrecio = /^[+-]?\d+([,.]\d+)?$/;

// Acumulan la información sobre los métodos de pago a desplegar:
var formaPago;

/* Las siguientes sólo en caso de querer sacar mensajes de error si hay errores en estos campos.
    NO están inicializadas ni usadas todavía:
var titularTarjeta;
var numeroTarjeta;
var cvv;
*/

var importeEfectivo;  // para sacar en la caja de Importe efectivo el valor de Precio total del carrito

var capaTarjeta;  // guarda los datos de la capa oculta (div) del metodo de pago Tarjeta
var capaEfectivo;  // guarda los datos de la capa oculta (div) del metodo de pago Efectivo

var botonAceptar;  // almacena el elemento del botón de Aceptar condiciones

var botonImprimir;
var botonRestablecer;

alert(nombreArticulo.value);  //comprobar qu puede obtener el valor de value

function initVariables() {
    nombreArticulo = document.getElementById("nombreArticulo");
    precioArticulo = document.getElementById("precioArticulo");
    unidadesArticulo = document.getElementById("unidades");
    botonAñadir = document.getElementById("add");

    faltaNombre = document.getElementById("faltaNombre");
    faltaPrecio = document.getElementById("faltaPrecio");
    errorDato = document.getElementById("datoIncorrecto");
    
    articulosCarrito = document.getElementById("articulosCarrito");
    precioTotalCarrito = document.getElementById("precioTotal");
    
    formaPago = document.formulario.opcionPago;
    
    /* Las siguientes sólo en caso de querer sacar mensajes de error si hay errores en estos campos.
    NO están inicializadas ni usadas todavía:
    
    titularTarjeta = document.formulario.titular;
    numeroTarjeta = document.formulario.numTarjeta;
    cvv = document.formulario.cvvTarj;
    */

    importeEfectivo = document.getElementById("importeEfectivo");

    capaTarjeta = document.getElementById("capaTarjeta");
    capaEfectivo = document.getElementById("capaEfectivo");
    capaTarjeta.style.display="none";  
    capaEfectivo.style.display="none";

    botonAceptar = document.getElementById("botonAceptar");

    botonImprimir = document.getElementById("botonPrint");
    botonRestablecer = document.getElementById("botonRestablecer");
    botonImprimir.disabled = true;
    
}



// ¿¿ PUEDE SER QUE FALLE POR LA ESTRUCTURA HTML DEL FORMULARIO SIN VALUES?

// Duda: Se pueden poner varias funciones en el eventListener???
function initListener() {  
    botonAñadir.addEventListener("click", comprobarValores); // cuando se hace click en el botón Añadir al carrito ("click"), llama a la función comprobarValores()
    formaPago.addEventListener("change", cargarPago);  // cuando el value del Método de pago cambia ("change"), llama a la función cargarPago()
    botonAceptar.addEventListener("change", habilitarImprimir);  //  cuando cambia el estado del botón "Aceptar condiciones" llama a la función habilitarImprimir()
}

window.onload = function () {
    initVariables();
    initListener();
}

// La siguiente función habilita el botón de "Imprimir" cuando se hace click en el botón de "Aceptar condiciones"

function habilitarImprimir () {
    if (botonAceptar.checked == true) {
       botonImprimir.disabled = false; 
    } else {
        botonImprimir.disabled = true;
    }
}

function comprobarValores () {
    if (nombreArticulo.value == "" && precioArticulo.value == "") {
        faltaNombre.textContent = "Falta artículo";
        nombreArticulo.focus();
        faltaPrecio.textContent = "Falta precio";
    } else if (nombreArticulo.value == "") {
        faltaNombre.textContent = "Falta artículo";
        nombreArticulo.focus();
    }
    else if (precioArticulo.value == "") {
        faltaPrecio.textContent = "Falta precio";
        faltaPrecio.focus();
    }
    else if (caracteresPrecio.test(precioArticulo.value)) {
        errorDato.textContent = "Tipo de dato incorrecto: introduzca solo números";
    } 
    else {
        calcularImporte();
    } 
}

// Funciones relacionadas con el botón "Añadir al carrito":
// calcularImporte() calcula el importe por artículo, multiplicando precio por numero de unidades
function calcularImporte () {  
    importeTotalArticulo = precioArticulo.value * unidadesArticulo.value;
    sumarImportes();
}

//suma los importes y lo saca en la caja de texto del "Precio total del carrito"
// aunar esta y la de arriba?
function sumarImportes () {  
    precioTotalCarrito.value += importeTotalArticulo;
    escribirNombresArticulos();
}


function escribirNombresArticulos () {  // Añade el nombre del artículo a la lista de "Artículos en el carrito"
    articulosCarrito.value = articulosCarrito.value.concat(',', nombreArticulo.value); //?? cómo concatenar varias veces el value // AÑADIR UN BUCLE??
    // ??usar .text en lugar de .value en articulosCarrito.value al principio?? 
}


//La función resetValores() vuelve a poner en blanco las cajas de texto de nombre y precio del artículo y pone focus sobre la primera

function resetValores () {  
    nombreArticulo.value = "";  // Elimina el contenido de las tres cajas de texto de arriba (nombre, precio)
    precioArticulo.value = "";
    unidadesArticulo.value = 1;  // numero de unidades a 1 por defecto
    nombreArticulo.focus();   // hace focus sobre la caja de texto del nombre de artículo
}


// La función cargarPago() se encarga de desplegar las opciones de pago según lo que se seleccione (tarjeta o efectivo)

function cargarPago () {
    if (formaPago.value == "seleccione"){
        capaTarjeta.style.display="none";
        capaEfectivo.style.display="none";
    } else if (formaPago.value == "tarjeta"){
        capaTarjeta.style.display="block";
        capaEfectivo.style.display="none";
    } else {
        capaTarjeta.style.display="none";
        capaEfectivo.style.display="block";
        importeEfectivo.value = precioTotalCarrito.value;  // Saca el valor del "Precio total del carrito"
    }
}