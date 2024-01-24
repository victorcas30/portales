// script.js
let tipoDirectorioSeleccionado = "";
let ciudadSeleccionada = 0;
let especialidadSeleccionada = 0;

/**************************************      ESPECIALIDAD        ********************************************** */

document.addEventListener("DOMContentLoaded", () => {
    const especialidadesSelect = document.getElementById("especialidadesSelect");
    // Agregar la opción "Seleccione" al principio del select
    const optionSeleccione = document.createElement("option");
    optionSeleccione.value = "";
    optionSeleccione.textContent = "Selecciona una Especialidad:";
    especialidadesSelect.appendChild(optionSeleccione);

    // Obtener datos de la API de especialidades
    fetch("https://redmedicaservice.devacsa.com/api/Directorios/obtenerespecialidadesrpn")
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
    fetch("https://redmedicaservice.devacsa.com/api/Directorios/obtenerubicacionesrpn")
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

function realizarBusqueda() {

    $('#loadingSpinner').show();

    // Obtener valores de los campos del formulario
    const nombreBusqueda = document.getElementById("nombreBusqueda").value;
    const especialidadSelect = especialidadSeleccionada;
    const ubicacionesSelect = ciudadSeleccionada;

    // Construir la URL de la API con los parámetros de búsqueda
    const url = `https://redmedicaservice.devacsa.com/api/Directorios/obtenerdirectoriomedicorpn?&IdCiudad=${ubicacionesSelect}&IdEspecialidad=${especialidadSelect}&NombreBusqueda=${nombreBusqueda}&elementosporpagina=2500&paginaactual=1`;
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
                            case "Médico":
                                additionalContent.innerHTML = '<i class="fa-duotone fa-user-doctor fa-xl"></i> ' + " " + medico.tipo;
                                break;
                            case "Hospital":
                                additionalContent.innerHTML = '<i class="fa-duotone fa-hospital fa-xl"></i> ' + " " + medico.tipo;
                                break;
                            case "Laboratorio":
                                additionalContent.innerHTML = '<i class="fa-duotone fa-house-chimney-medical fa-xl"></i> ' + " " +  medico.tipo;
                                break;
                            case "Farmacia":
                                additionalContent.innerHTML = '<i class="fa-duotone fa-capsules fa-xl"></i> ' + " " +  medico.tipo;
                                break;
                            case "Alquiler de Equipo":
                                additionalContent.innerHTML = '<i class="fa-duotone fa-stretcher fa-xl"></i> ' + " " +  medico.tipo;
                                break;
                            case "Centro de Diagnóstico":
                                additionalContent.innerHTML = '<i class="fa-duotone fa-clipboard-medical fa-xl"></i> ' + " " +  medico.tipo;
                                break;
                            case "Centro Radiológico":
                                additionalContent.innerHTML = '<i class="fa-duotone fa-x-ray fa-xl"></i> ' + " " +  medico.tipo;
                                break;
                            case "Agrupación Médica":
                                additionalContent.innerHTML = '<i class="fa-duotone fa-users-medical fa-xl"></i> ' + " " +  medico.tipo;
                                break;
                            case "Servicios Integrales":
                                additionalContent.innerHTML = '<i class="fa-duotone fa-notes-medical fa-xl"></i> ' + " " +  medico.tipo;
                                break;
                            case "Odontólogo":
                                additionalContent.innerHTML = '<i class="fa-duotone fa-teeth fa-xl"></i> ' + " " +  medico.tipo;
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
    

                    const body = document.createElement("div");
                    body.classList.add("accordion-body");
                    body.innerHTML += `
                        <i class="fa-duotone fa-stethoscope"></i> ${medico.especialidad} <br/>
                        <i class="fa-duotone fa-phone"></i> ${
                            medico.telefonoFijo
                                ? `<a href="tel:${medico.telefonoFijo}" class="no-link-style mb-1">${medico.telefonoFijo}</a>`
                                : "No disponible"
                        } <br/>
                        <i class="fa-duotone fa-mobile"></i> ${
                            medico.telefonoMovil
                            ? `<a href="tel:${medico.telefonoMovil}" class="no-link-style mb-1">${medico.telefonoMovil}</a>`
                            : "No disponible"
                        } <br/>
                        <i class="fa-duotone fa-envelope-open-text"></i> ${
                            medico.email
                                ? `<a href="mailto:${medico.email}" class="no-link-style mb-1">${medico.email}</a>`
                                : "No disponible"
                        } <br/>
                        <i class="fa-duotone fa-map-location-dot"></i> ${
                            medico.direccion
                            ? `<a href="https://www.google.com/maps/search/${encodeURIComponent(medico.direccion)}" target="_blank" class="no-link-style mb-1">${medico.direccion}</a>`
                            : "No disponible"
                        } <br/>
                        <br/>
                    `;
                    
                    collapse.appendChild(body);
                    

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
