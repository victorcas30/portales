// script.js
let tipoDirectorioSeleccionado = "";
let ciudadSeleccionada = 0;
let especialidadSeleccionada = 0;
let telemedicinaSeleccionada = "";


/**************************************      TIPO DIRECTORIO        ********************************************** */

document.addEventListener("DOMContentLoaded", () => {
    const radioContainer = document.getElementById("radio-container");
    const searchButton = document.getElementById("searchButton");
    const especialidadesSelect = document.getElementById("especialidadesSelect");
    const ubicacionesSelect = document.getElementById("ubicacionesSelect");
    const telemedicinaSelect = document.getElementById("telemedicinaSelect");
    const nombreBusqueda = document.getElementById("nombreBusqueda");



    // Obtener datos de la API
    fetch("https://redmedicaservice.devacsa.com/api/Directorios/obtenertiposdirectorio")
        .then(response => response.json())
        .then(data => {
            // Variable para determinar si es el primer radio button
            let isFirst = true;

            // Crear radio buttons con los datos de la API
            data.forEach(item => {
                // Crear div con clase "form-check" para utilizar estilos de Bootstrap
                const radioWrapper = document.createElement("div");
                radioWrapper.classList.add("form-check", "radio-container");

                // Crear radio button
                const radio = document.createElement("input");
                radio.type = "radio";
                radio.name = "tipoDirectorio";
                radio.value = item.idTipo;
                radio.id = `radio-${item.idTipo}`;
                radio.classList.add("form-check-input");

                // Si es el primer radio button, agregar el atributo "checked"
                if (isFirst) {
                    radio.setAttribute("checked", "checked");
                    tipoDirectorioSeleccionado = item.idTipo; // Actualizar la variable
                    isFirst = false;
                }

                // Crear label con el atributo "for" que coincide con el id del radio button
                const label = document.createElement("label");
                label.textContent = item.nomTipoDirectorio;
                label.setAttribute("for", `radio-${item.idTipo}`);
                label.classList.add("form-check-label", "text-wrapper-6", "radio-container");
                label.style = "white-space: normal; word-wrap: break-word; text-align: left;";  


                // Agregar evento de cambio al radio button para actualizar la variable tipoDirectorioSeleccionado
                radio.addEventListener("change", function() {
                    tipoDirectorioSeleccionado = this.value;
                    especialidadesSelect.value = "";
                    ubicacionesSelect.value = "";
                    telemedicinaSelect.value = "";
                    nombreBusqueda.value = "";
                    
                    // Deshabilitar el select de especialidades si el tipo de directorio es "Medico"
                    if (tipoDirectorioSeleccionado === "MEDICO") {
                        especialidadesSelect.disabled = false;
                        //console.log("especialidades TRUE:");
                    } else {
                        especialidadesSelect.disabled = true;
                        //console.log("especialidades FALSE:");
                    }
                    //console.log("Tipo de Directorio Seleccionado:", tipoDirectorioSeleccionado);
                    // Deshabilitar el select de especialidades si el tipo de directorio es "Medico"
                    if (tipoDirectorioSeleccionado === "FARMACIA") {
                        telemedicinaSelect.disabled = true;
                        //console.log("telemedicinaSelect TRUE:");
                    } else {
                        telemedicinaSelect.disabled = false;
                        //console.log("telemedicinaSelect FALSE:");
                    }

                });

                // Agregar radio button y label al contenedor
                radioWrapper.appendChild(radio);
                radioWrapper.appendChild(label);

                // Agregar el contenedor al contenedor principal
                radioContainer.appendChild(radioWrapper);

                // Agregar salto de línea para separar los radio buttons
                radioContainer.appendChild(document.createElement("br"));
            });
        })
        .catch(error => console.error("Error fetching data:", error));    
});


/**************************************      ESPECIALIDAD        ********************************************** */

document.addEventListener("DOMContentLoaded", () => {
    const especialidadesSelect = document.getElementById("especialidadesSelect");
    // Agregar la opción "Seleccione" al principio del select
    const optionSeleccione = document.createElement("option");
    optionSeleccione.value = "";
    optionSeleccione.textContent = "Selecciona una Especialidad:";
    especialidadesSelect.appendChild(optionSeleccione);

    // Obtener datos de la API de especialidades
    fetch("https://redmedicaservice.devacsa.com/api/Directorios/obtenerespecialidades")
        .then(response => response.json())
        .then(data => {
            // Llenar el select con las opciones de especialidades
            data.forEach(especialidad => {  
                const option = document.createElement("option");
                option.value = especialidad.idEspecialidad;
                option.textContent = especialidad.nomEspecialidad;
                especialidadesSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching data:", error));

    // Agregar evento de cambio al select de especialidades para actualizar la variable especialidadSeleccionada
    especialidadesSelect.addEventListener("change", function() {
        especialidadSeleccionada = this.value;
        console.log("Especialidad Seleccionada:", especialidadSeleccionada);
    });
});

/**************************************      UBICACION        ********************************************** */


document.addEventListener("DOMContentLoaded", () => {
    const ubicacionesSelect = document.getElementById("ubicacionesSelect");
    // Agregar la opción "Seleccione" al principio del select
    const optionSeleccione = document.createElement("option");
    optionSeleccione.value = "";
    optionSeleccione.textContent = "Selecciona una Ubicación:";
    ubicacionesSelect.appendChild(optionSeleccione);

    // Obtener datos de la API de ubicaciones
    fetch("https://redmedicaservice.devacsa.com/api/Directorios/obtenerubicaciones")
        .then(response => response.json())
        .then(data => {
            // Llenar el select con las opciones de ubicaciones
            data.forEach(ubicacion => {
                const option = document.createElement("option");
                option.value = ubicacion.idUbicacion;
                option.textContent = ubicacion.nomUbicacion;
                ubicacionesSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching data:", error));

    // Agregar evento de cambio al select de ubicaciones para actualizar la variable ciudadSeleccionada
    ubicacionesSelect.addEventListener("change", function() {
        ciudadSeleccionada = this.value;
        //console.log("Ciudad Seleccionada:", ciudadSeleccionada);
    });
});

/**************************************      TELEMEDICINA        ********************************************** */

document.addEventListener("DOMContentLoaded", () => {
    const telemedicinaSelect = document.getElementById("telemedicinaSelect");
    // Agregar la opción "Seleccione" al principio del select
    const optionSeleccione = document.createElement("option");
    optionSeleccione.value = "";
    optionSeleccione.textContent = "Seleccionar";
    telemedicinaSelect.appendChild(optionSeleccione);

    // Obtener datos de la API de Telemedicina
    fetch("https://redmedicaservice.devacsa.com/api/Directorios/obtenertelemedicina")
        .then(response => response.json())
        .then(data => {
            // Llenar el select con las opciones de Telemedicina
            data.forEach(opcion => {
                const option = document.createElement("option");
                option.value = opcion.id;
                option.textContent = opcion.descripcion;
                telemedicinaSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching data:", error));

    // Agregar evento de cambio al select de Telemedicina para actualizar la variable telemedicinaSeleccionada
    telemedicinaSelect.addEventListener("change", function() {
        telemedicinaSeleccionada = this.value;
        //console.log("Opción de Telemedicina Seleccionada:", telemedicinaSeleccionada);
    });
});

function realizarBusqueda() {

    $('#loadingSpinner').show();

    // Obtener valores de los campos del formulario
    const nombreBusqueda = document.getElementById("nombreBusqueda").value;
    const tipoDirectorio = tipoDirectorioSeleccionado;
    const ubicacionesSelect = ciudadSeleccionada;
    const especialidadSelect = especialidadSeleccionada;
    const telemedicina = telemedicinaSeleccionada;

    // Construir la URL de la API con los parámetros de búsqueda
    const url = `https://redmedicaservice.devacsa.com/api/Directorios/obtenerdirectoriomedico?tipoDirectorio=${tipoDirectorio}&IdCiudad=${ubicacionesSelect}&IdEspecialidad=${especialidadSelect}&TeleMedicina=${telemedicina}&NombreBusqueda=${nombreBusqueda}&elementosporpagina=1000&paginaactual=1`;
    try {
    // Realizar la solicitud a la API
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Ocultar el modal después de completar la búsqueda
            $('#loadingSpinner').hide();
            const resultadosDiv = document.getElementById("resultados");

            resultadosDiv.innerHTML = "";

            if (data.medicos && data.medicos.length > 0) {
                const accordion = document.createElement("div");
                accordion.classList.add("accordion", "accordion-flush");
    
                data.medicos.forEach((medico, index) => {
                    const item = document.createElement("div");
                    item.classList.add("accordion-item");
                
                    const header = document.createElement("h2");
                    header.classList.add("accordion-header");
                    header.id = `flush-heading${index + 1}`;
                
                    const button = document.createElement("button");
                    button.classList.add("accordion-button", "collapsed", "text-wrapper-5", "d-flex", "justify-content-start", "flex-column");
                    button.setAttribute("type", "button");
                    button.setAttribute("data-bs-toggle", "collapse");
                    button.setAttribute("data-bs-target", `#flush-collapse${index + 1}`);
                    button.setAttribute("aria-expanded", "false");
                    button.setAttribute("aria-controls", `flush-collapse${index + 1}`);
                    button.style.alignItems = "start";  
                    
                        const additionalContent = document.createElement("div");
                        additionalContent.classList.add("text-wrapper-5");
                        additionalContent.style.paddingBottom = "10px"; 
    
                        // Añadir ícono según el tipo de médico
                        switch (medico.tipo) {
                            case "Medicos":
                                additionalContent.innerHTML = '<i class="fa-duotone fa-user-doctor fa-xl"></i> ' + " " + medico.tipo;
                                break;
                            case "Laboratorios y Clinicas":
                                additionalContent.innerHTML = '<i class="fa-duotone fa-house-chimney-medical fa-xl"></i> ' + " " +  medico.tipo;
                                break;
                            case "Hospitales":
                                additionalContent.innerHTML = '<i class="fa-duotone fa-hospital fa-xl"></i> ' + " " + medico.tipo;
                                break;
                            case "Clinicas":
                                additionalContent.innerHTML = '<i class="fa-duotone fa-stethoscope fa-xl"></i> ' + " " +  medico.tipo;
                                break;
                            case "Farmacias":
                                additionalContent.innerHTML = '<i class="fa-duotone fa-capsules fa-xl"></i> ' + " " +  medico.tipo;
                                break;
                            default:
                                additionalContent.textContent = medico.tipo;  // Si no coincide con ningún tipo, muestra el texto
                        }
    
                        button.appendChild(additionalContent);
                
                    const contentWrapper = document.createElement("div");
                    contentWrapper.classList.add("heading-h");
                    contentWrapper.textContent = `${index + 1} - ${medico.nombre}`;
                    contentWrapper.style = "white-space: normal; word-wrap: break-word; text-align: left;";  

                    button.appendChild(contentWrapper);
                
                    header.appendChild(button);
                
                    const collapse = document.createElement("div");
                    collapse.id = `flush-collapse${index + 1}`;
                    collapse.classList.add("accordion-collapse", "collapse");
                    collapse.setAttribute("aria-labelledby", `flush-heading${index + 1}`);
                    collapse.setAttribute("data-bs-parent", "#accordionFlushExample");
    
                    // Si el tipo de médico es "Medicos", mostrar la información de la especialidad
                    if (medico.tipo === "Medicos") {
                        // Nuevo div para la especialidad
                        const body = document.createElement("div");
                        body.classList.add("accordion-body");
                        body.innerHTML += `
                            <i class="fa-duotone fa-stethoscope"></i> ${medico.especialidad} <br/>
                            <i class="fa-duotone fa-phone"></i> <a href="tel:${medico.telefonoFijo}" class="no-link-style mb-1">${medico.telefonoFijo}</a> <br/>
                            <i class="fa-duotone fa-envelope-open-text"></i> <a href="mailto:${medico.email}" class="no-link-style mb-1">${medico.email}</a> <br/>
                            <i class="fa-duotone fa-map-location-dot"></i> ${medico.direccion} 
                            <br/>
                            <a href="ver-mas.html?id=${medico.idProveedorMedico}" target="_blank" class="btn btn-sm" style="background-color: #003a84; border-color: #003a84; color: #fff;"><i class="fa-duotone fa-arrow-right"></i> Ver más</a>
                        `;
                        collapse.appendChild(body);
                    } else {
                        // Si el tipo de médico no es "Medicos", mostrar información básica
                        const body = document.createElement("div");
                        body.classList.add("accordion-body");
                        body.innerHTML += `
                            <i class="fa-duotone fa-phone"></i> <a href="tel:${medico.telefonoFijo}" class="no-link-style mb-1">${medico.telefonoFijo}</a> <br/>
                            <i class="fa-duotone fa-envelope-open-text"></i> <a href="mailto:${medico.email}" class="no-link-style mb-1">${medico.email}</a> <br/>
                            <i class="fa-duotone fa-map-location-dot"></i> ${medico.direccion} 
                            <br/>
                            <a href="ver-mas.html?id=${medico.idProveedorMedico}" target="_blank" class="btn btn-sm" style="background-color: #003a84; border-color: #003a84; color: #fff;"><i class="fa-duotone fa-arrow-right"></i> Ver más</a>
                        `;
                        collapse.appendChild(body);
                    }
                    item.appendChild(header);
                    item.appendChild(collapse);
                    accordion.appendChild(item);
                });
    
                resultadosDiv.appendChild(accordion);
            } else {
                // Si no hay resultados, mostrar un mensaje con estilo de Bootstrap
                const mensajeSinResultados = document.createElement("div");
                mensajeSinResultados.classList.add("alert", "alert-warning", "mt-3");
                mensajeSinResultados.innerHTML = `
                    <p class="mb-0">No se encontraron resultados para la búsqueda.</p>
                `;
                resultadosDiv.appendChild(mensajeSinResultados);
            }
        })
        .catch(error => {
            // Mostrar el error en la consola
            console.error("Error fetching data:", error);
            // Ocultar el modal en caso de error
            $('#loadingSpinner').hide();
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        $('#loadingSpinner').hide();
    }
}



document.addEventListener("DOMContentLoaded", () => {
    // Obtener valores de los campos del formulario
    const nombreBusqueda = document.getElementById("nombreBusqueda");
    // Agregar evento de teclado al campo de búsqueda para detectar la tecla Enter
    nombreBusqueda.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            // Evitar la recarga de la página al presionar Enter
            event.preventDefault();
            // Llamar a la función de búsqueda
            realizarBusqueda();
        }
    });
});
