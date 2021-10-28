
var nombreArticulo;    // almacena el nombre del artículo introducido en la caja
var precioArticulo;  // almacena el precio del artículo por unidad, como un string

var unidadesArticulo;  // almacena el número de unidades de cada artículo
var importeTotalArticulo;  // almacena el importe calculado a partir del precio del articulo multiplicado por número de unidades
var sumaTotalCarrito;  // se almacena la suma de los valores de la variable importeTotalArticulo

var botonAñadir;  // almacenala información del botón "Añadir al carrito" 

var articulosCarrito;  // almacena el valor de todos los artículos que se han ido añadiendo al carrito
var precioTotalCarrito;  // almacena el contenido o valor de la suma de los importes de todos lso artículos


// ERRORES: Se recogen los textos que deben salir por pantalla en caso de faltar datos en las cajas de texto iniciales:
var faltaNombre;
var faltaPrecio;
var errorDato;

// Patrón para comprobar que los datos introducidos en Precio son numéricos (pueden ser decimales de varios dígitos separados por coma o punto, y positivos o negativos, esto último en caso de descuentos(?))
var datosPrecio = /^[+-]?\d+(.\d+)?$/;

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

/*
La función initVariables () inicializa las variables declaradas arriba.
*/
function initVariables() {
    nombreArticulo = document.getElementById("nombreArticulo");
    precioArticulo = document.getElementById("precioArticulo");
    unidadesArticulo = document.getElementById("unidades");
    botonAñadir = document.getElementById("botonAñadir");

    faltaNombre = document.getElementById("faltaNombre");
    faltaPrecio = document.getElementById("faltaPrecio");
    errorDato = document.getElementById("datoIncorrecto");
    
    articulosCarrito = document.getElementById("articulosCarrito");
    precioTotalCarrito = document.getElementById("precioTotal");
    sumaTotalCarrito = 0;

    formaPago = document.getElementById("opcionPago");
    importeEfectivo = document.getElementById("importeEfectivo");

    capaTarjeta = document.getElementById("capaTarjeta");
    capaEfectivo = document.getElementById("capaEfectivo");
    capaTarjeta.style.display="none";  
    capaEfectivo.style.display="none";

    botonAceptar = document.getElementById("botonAceptar");

    botonImprimir = document.getElementById("botonImprimir");
    botonRestablecer = document.getElementById("botonRestablecer");
    botonImprimir.disabled = true;
    
}

/*
La función initListener() se encarga de llamar a las funciones corrrespondientes en función de los eventos
que se producen en cada elemento/variable, como los clicks sobre ellos o el cambio de estado.
- cuando se hace click en el botón Añadir al carrito ("click"), llama a la función comprobarValores()
- cuando el value del Método de pago cambia ("change"), llama a la función cargarPago()
- cuando cambia el estado del botón "Aceptar condiciones" (es decir, cuando cambia de checked a unchecked, llama a la función habilitarImprimir()
*/

function initListener() {  
    botonAñadir.addEventListener("click", comprobarValores); 
    formaPago.addEventListener("change", cargarPago);  
    botonAceptar.addEventListener("change", habilitarImprimir);  
    botonImprimir.addEventListener("click", alertImprimir); 
    botonRestablecer.addEventListener("click", resetTotal);
}

/*
La siguiente función anónima llama a las funciones que inician las variables y "escuchan" los eventos que dan funcionalidad
a la página, una vez ha sido cargada (onload)
*/

window.onload = function () {
    initVariables();
    initListener();
}


/* La función comprobarValores() comprueba que las cajas de texto de nombre de artículo
y precio del artículo no queden vacías. En caso de no estar vacías, llama a la función
comprobarPrecio(), que comprobará si el dato del precio es correcto (es decir, numérico)
*/
function comprobarValores () {
    if (nombreArticulo.value == "" && precioArticulo.value == "") { 
        faltaNombre.textContent = "Falta artículo";
        faltaPrecio.textContent = "Falta precio";
        nombreArticulo.focus();   
    } else if (nombreArticulo.value == "") {
        faltaNombre.textContent = "Falta artículo";
        nombreArticulo.focus();
    } else if (precioArticulo.value == "") {
        faltaPrecio.textContent = "Falta precio";
        precioArticulo.focus();
    } else {
        faltaNombre.textContent = "";
        faltaPrecio.textContent = "";
        if (!isNaN(precioArticulo.value)) {
            alert("precio correcto");
            //errorDato.textContent = "El dato de precio es correcto";
            añadirCarrito();
        } else {
            errorDato.textContent = "Tipo de dato incorrecto: introduzca solo números, los decimales separados con punto";
            precioArticulo.focus();
        }
        //comprobarPrecio();
    }
}

/*
La función añadirCarrito() llama a las funciones que deben realizarse cuando se aprieta el botón "Añadir al carrito":
*/
function añadirCarrito () {
    sumarImportes();
    escribirNombresArticulos();
    resetValoresCarrito();
}

/* sumarImportes() calcula el importe total por artículo, multiplicando precio por numero de unidades
A continuación, suma/acumula los importes y los guarda en la variable sumaTotalCarrito
El valor de sumaTotalCarrito se asigna al valor de la caja de texto del "Precio total del carrito"
para que aparezca escrita la suma total de toda la compra
*/
function sumarImportes () {  
    var precioArtNumero = parseFloat(precioArticulo.value);
    importeTotalArticulo = precioArtNumero * unidadesArticulo.value;
    sumaTotalCarrito += importeTotalArticulo;
    precioTotalCarrito.value = sumaTotalCarrito;
}

/*
// Añade el nombre o value de cada artículo (nombreArticulo.value) a la lista de "Artículos en el carrito", concatenándolos
*/
function escribirNombresArticulos () {  
    articulosCarrito.value = articulosCarrito.value.concat(nombreArticulo.value, ', '); //?? cómo concatenar varias veces el value // AÑADIR UN BUCLE??
}


/*
La función resetValoresCarrito() vuelve a poner en blanco las cajas de texto de nombre y precio del artículo, resetea sus valores
y pone focus sobre la primera
También elimina los mensajes de error (faltaNombre, faltaPrecio o errorDato) 
*/
function resetValoresCarrito () {  
    nombreArticulo.value = "";  // Elimina el contenido de las tres cajas de texto de arriba (nombre, precio)
    precioArticulo.value = "";
    unidadesArticulo.value = 1;  // numero de unidades a 1 por defecto
    nombreArticulo.focus();   // hace focus sobre la caja de texto del nombre de artículo
    faltaNombre.textContent = "";
    faltaPrecio.textContent = "";
    errorDato.textContent = "";
}


/* La función cargarPago() se encarga de desplegar las opciones de pago según lo que se seleccione (tarjeta o efectivo).
En caso de elejir la opción Efectivo, copia el value (valor o contenido) del precioTotalCarrito en una caja
con el importe a pagar en efectivo (importeEfectivo)
*/
function cargarPago () {
    if (formaPago.value == "seleccione") {
        capaTarjeta.style.display="none";
        capaEfectivo.style.display="none";
    } else if (formaPago.value == "tarjeta") {
        capaTarjeta.style.display="block";
        capaEfectivo.style.display="none";
    } else {
        capaTarjeta.style.display="none";
        capaEfectivo.style.display="block";
        importeEfectivo.value = precioTotalCarrito.value;  
    }
}

/* 
La función habilitarImprimir activa el botón de "Imprimir" cuando se hace click en el botón de "Aceptar condiciones" (checked).
Si el botón de Aceptar condiciones no está marcado (checked == false) NO se habilita el de Imprimir
*/
function habilitarImprimir () {
    if (botonAceptar.checked == true) {
       botonImprimir.disabled = false; 
    } else {
        botonImprimir.disabled = true;
    }
}

/*
La función alertImprimir() saca un mensaje de alerta con el total del precio y artículos del carrito
En caso de que ninguna opción de pago haya sido escogida, saca un alert pidiendo que se seleccione una.
*/

function alertImprimir () {
    if (formaPago.value == "seleccione") {
        alert("Seleccione una forma de pago");
    }
    else {
        alert("Los artículos de mi carrito son: " + articulosCarrito.value + " y el precio total es: " + precioTotalCarrito.value);
    }
}

/*
La función resetTotal() resetea los valores de todas las cajas, vaciándolas de contenido para que el proceso
pueda empezar de nuevo. 
Lleva otra vez el focus a la caja del nombre del artículo.
*/
function resetTotal() {
    nombreArticulo.value = "";  // Elimina el contenido de las tres cajas de texto de arriba (nombre, precio)
    precioArticulo.value = "";
    unidadesArticulo.value = 1;  // numero de unidades a 1 por defecto
    nombreArticulo.focus(); 
    articulosCarrito.value = "";
    precioTotalCarrito.value = "";
    importeEfectivo.value = "";
}
