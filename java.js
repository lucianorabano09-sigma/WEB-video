// VARIABLES

// Lista donde se guardan los equipos
let equipos = [];

let editando = false;
let indiceEdicion;

// ELEMENTOS DEL HTML

const formulario = document.getElementById("formulario-equipo");
const contenedor = document.getElementById("contenedor-equipos");
const botonEnviar = document.getElementById("botonEnviar");
const buscarEquipo = document.getElementById("buscarEquipo");
const filtroEstado = document.getElementById("filtroEstado");

// CARGAR DATOS DE LOCALSTORAGE

// Recuperamos los equipos guardados
let equiposGuardados = localStorage.getItem("equipos");

if (equiposGuardados != null) {
    equipos = JSON.parse(equiposGuardados);
}

// GUARDAR EN LOCALSTORAGE

function guardarEquipos() {

    localStorage.setItem("equipos", JSON.stringify(equipos));
}

// AGREGAR Y EDITAR EQUIPOS

formulario.addEventListener("submit", function(evento) {

    evento.preventDefault();

    let tipo = document.getElementById("tipo").value;
    let titular = document.getElementById("titular").value;
    let marca = document.getElementById("marca").value;
    let modelo = document.getElementById("modelo").value;
    let procesador = document.getElementById("procesador").value;
    let ram = document.getElementById("ram").value;
    let almacenamiento = document.getElementById("almacenamiento").value;
    let placaVideo = document.getElementById("placaVideo").value;
    let pulgadas = document.getElementById("pulgadas").value;
    let estado = document.getElementById("estado").value;

    // Creamos un objeto con los datos del equipo

    let equipo = {

        tipo: tipo,
        titular: titular,
        marca: marca,
        modelo: modelo,
        procesador: procesador,
        ram: ram,
        almacenamiento: almacenamiento,
        placaVideo: placaVideo,
        pulgadas: pulgadas,
        estado: estado
    };

    // Si no estamos editando, agregamos un equipo nuevo

    if (editando == false) {

        equipos.push(equipo);

    } else {

        equipos[indiceEdicion] = equipo;
    }

    // Guardamos los cambios

    guardarEquipos();

    // Limpiamos el formulario

    formulario.reset();

    botonEnviar.textContent = "Agregar Equipo";

    editando = false;

    indiceEdicion = "";


    buscarYMostrar();
});

// MOSTRAR EQUIPOS

function renderizarEquipos(listaAVisualizar = equipos) {

    contenedor.innerHTML = "";

    for (let i = 0; i < listaAVisualizar.length; i++) {

        let equipoActual = listaAVisualizar[i];

        let tarjeta = document.createElement("div");

        tarjeta.className = "tarjeta-equipo";

        tarjeta.innerHTML = `
            <h3>${equipoActual.tipo}</h3>

            <p><strong>Titular:</strong> ${equipoActual.titular}</p>

            <p><strong>Marca:</strong> ${equipoActual.marca}</p>

            <p><strong>Modelo:</strong> ${equipoActual.modelo}</p>

            <p><strong>Procesador:</strong> ${equipoActual.procesador}</p>

            <p><strong>RAM:</strong> ${equipoActual.ram}</p>

            <p><strong>Almacenamiento:</strong> ${equipoActual.almacenamiento}</p>

            <p><strong>Placa de video:</strong> ${equipoActual.placaVideo}</p>

            <p><strong>Pulgadas:</strong> ${equipoActual.pulgadas}</p>

            <p class="estado">
                <strong>Estado:</strong> ${equipoActual.estado}
            </p>
        `;

        // BOTON EDITAR

        let botonEditar = document.createElement("button");

        botonEditar.textContent = "Editar";


        botonEditar.addEventListener("click", function() {

            let indice = equipos.indexOf(equipoActual);


            // Cargamos los datos en el formulario

            document.getElementById("tipo").value = equipoActual.tipo;
            document.getElementById("titular").value = equipoActual.titular;
            document.getElementById("marca").value = equipoActual.marca;
            document.getElementById("modelo").value = equipoActual.modelo;
            document.getElementById("procesador").value = equipoActual.procesador;
            document.getElementById("ram").value = equipoActual.ram;
            document.getElementById("almacenamiento").value = equipoActual.almacenamiento;
            document.getElementById("placaVideo").value = equipoActual.placaVideo;
            document.getElementById("pulgadas").value = equipoActual.pulgadas;
            document.getElementById("estado").value = equipoActual.estado;


            botonEnviar.textContent = "Guardar Cambios";

            editando = true;

            indiceEdicion = indice;
        });

        // BOTON ELIMINAR

        let botonEliminar = document.createElement("button");

        botonEliminar.textContent = "Eliminar";


        botonEliminar.addEventListener("click", function() {

            let indice = equipos.indexOf(equipoActual);

            equipos.splice(indice, 1);


            // Guardamos después de eliminar

            guardarEquipos();

            buscarYMostrar();
        });


        tarjeta.appendChild(botonEditar);

        tarjeta.appendChild(botonEliminar);

        contenedor.appendChild(tarjeta);
    }
}

// BUSCAR Y FILTRAR EQUIPOS

function buscarYMostrar() {

    let textoBuscado = buscarEquipo.value.toLowerCase();

    let estadoSeleccionado = filtroEstado.value;

    // Filtramos los equipos

    let equiposFiltrados = equipos.filter(function(equipo) {

        let coincideBusqueda =
            equipo.titular.toLowerCase().includes(textoBuscado) ||
            equipo.marca.toLowerCase().includes(textoBuscado);


        let coincideEstado =
            estadoSeleccionado == "Todos" ||
            equipo.estado == estadoSeleccionado;


        return coincideBusqueda && coincideEstado;
    });


    renderizarEquipos(equiposFiltrados);

    actualizarContadores();
}

// BUSCADOR

buscarEquipo.addEventListener("input", buscarYMostrar);


// FILTRO POR ESTADO

filtroEstado.addEventListener("change", buscarYMostrar);


// CONTADORES

function actualizarContadores() {

    let total = equipos.length;

    let operativos = 0;
    let reparacion = 0;
    let descartados = 0;


    // Contamos los equipos según su estado

    for (let i = 0; i < equipos.length; i++) {

        if (equipos[i].estado == "Operativo") {

            operativos++;

        } else if (equipos[i].estado == "En reparación") {

            reparacion++;

        } else if (equipos[i].estado == "Descartado") {

            descartados++;
        }
    }


    document.getElementById("contadorTotal").textContent = total;

    document.getElementById("contadorOperativos").textContent = operativos;

    document.getElementById("contadorReparacion").textContent = reparacion;

    document.getElementById("contadorDescartados").textContent = descartados;
}

// EXPORTAR A JSON

document.getElementById("botonExportar").addEventListener("click", function() {

    // Convertimos los equipos a formato JSON

    let datosJSON = JSON.stringify(equipos, null, 2);


    // Creamos el archivo

    let archivo = new Blob([datosJSON], {
        type: "application/json"
    });


    let enlace = document.createElement("a");

    enlace.href = URL.createObjectURL(archivo);

    enlace.download = "equipos.json";

    enlace.click();
});

// IMPORTAR JSON

document.getElementById("importarJSON").addEventListener("change", function(evento) {

    let archivo = evento.target.files[0];


    if (!archivo) {
        return;
    }

    let lector = new FileReader();


    lector.onload = function(e) {

        try {

            // Convertimos el archivo JSON a datos

            let datosImportados = JSON.parse(e.target.result);


            if (Array.isArray(datosImportados)) {

                equipos = datosImportados;


                // Guardamos los datos importados

                guardarEquipos();


                buscarYMostrar();

                alert("Los equipos fueron importados correctamente.");

            } else {

                alert("El archivo no tiene el formato correcto.");
            }

        } catch (error) {

            alert("No se pudo leer el archivo JSON.");
        }
    };

    lector.readAsText(archivo);
});

// MOSTRAR LOS EQUIPOS AL ABRIR LA PÁGINA

renderizarEquipos();

actualizarContadores();