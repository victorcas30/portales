// script.js
let tipoDirectorioSeleccionado = "";
let ciudadSeleccionada = 0;
let especialidadSeleccionada = 0;
let telemedicinaSeleccionada = "";


/**************************************      UBICACION        ********************************************** */


document.addEventListener("DOMContentLoaded", () => {
    const ubicacionesSelect = document.getElementById("ubicacionesSelect");
    // Agregar la opción "Seleccione" al principio del select
    const optionSeleccione = document.createElement("option");
    optionSeleccione.value = "";
    optionSeleccione.textContent = "Selecciona una Ubicación:";
    ubicacionesSelect.appendChild(optionSeleccione);

    // Obtener datos de la API de ubicaciones
    fetch("https://redmedicaservice.devacsa.com/api/Directorios/obtenerubicacionestaller")
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
    const ubicacionesSelect = ciudadSeleccionada;

    // Verificar si nombreBusqueda está vacío antes de construir la URL
    const nombreBusquedaParametro = nombreBusqueda ? `&NombreBusqueda=${nombreBusqueda}` : '';

    // Construir la URL de la API con los parámetros de búsqueda
    const url = `https://redmedicaservice.devacsa.com/api/Directorios/obtenerdirectoriotaller?tipoDirectorio=AGENCIA&IdCiudad=${ubicacionesSelect}${nombreBusquedaParametro}&elementosporpagina=1000&paginaactual=1`;
    
    try {
    // Realizar la solicitud a la API
    fetch(url)
        .then(response => response.json())
        .then(data => {
            $('#loadingSpinner').hide();
            const resultadosDiv = document.getElementById("resultados");

            resultadosDiv.innerHTML = "";

            if (data.talleres && data.talleres.length > 0) {
                const accordion = document.createElement("div");
                accordion.classList.add("accordion", "accordion-flush");
    
                data.talleres.forEach((taller, index) => {
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

                    additionalContent.innerHTML = '<i class="fa-duotone fa-car fa-xl"></i>' + " " + (taller.ciudad ?? 'TALLER');
                    button.appendChild(additionalContent);
                
                    const contentWrapper = document.createElement("div");
                    contentWrapper.classList.add("heading-h");
                    contentWrapper.textContent = `${index + 1} - ${taller.nombre}`;
                    contentWrapper.style = "white-space: normal; word-wrap: break-word; text-align: left;";  

                    button.appendChild(contentWrapper);
                
                    header.appendChild(button);
                
                    const collapse = document.createElement("div");
                    collapse.id = `flush-collapse${index + 1}`;
                    collapse.classList.add("accordion-collapse", "collapse");
                    collapse.setAttribute("aria-labelledby", `flush-heading${index + 1}`);
                    collapse.setAttribute("data-bs-parent", "#accordionFlushExample");
    
                        // Nuevo div para la especialidad
                        const body = document.createElement("div");
                        body.classList.add("accordion-body");
                        const telefonoFijo = taller.telefonoFijo !== null && taller.telefonoFijo !== '' ? taller.telefonoFijo : 'Teléfono fijo no disponible';
                        const telefonoMovil = taller.telefonoMovil !== null && taller.telefonoMovil !== '' ? taller.telefonoMovil : 'Teléfono móvil no disponible';
                        const email = taller.email !== null && taller.email !== '' ? taller.email : 'Email no disponible';
                        const direccion = taller.direccion !== null && taller.direccion !== '' ? taller.direccion : 'Dirección no disponible';
                        body.innerHTML += `
                            <i class="fa-duotone fa-phone"></i> <a href="tel:${telefonoFijo}" class="no-link-style mb-1">${telefonoFijo}</a> <br/>
                            <i class="fa-duotone fa-mobile"></i> <a href="tel:${telefonoMovil}" class="no-link-style mb-1">${telefonoMovil}</a> <br/>
                            <i class="fa-duotone fa-envelope-open-text"></i> <a href="mailto:${email}" class="no-link-style mb-1">${email}</a> <br/>
                            <i class="fa-duotone fa-map-location-dot"></i> ${direccion} 
                            <br/>
                            <a href="ver-mas.html?id=${taller.idProveedorTaller}" target="_blank" class="btn btn-sm" style="background-color: #003a84; border-color: #003a84; color: #fff;"><i class="fa-duotone fa-arrow-right"></i> Ver más</a>
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
            $('#loadingSpinner').hide();
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        $('#loadingSpinner').hide();
    }
}

function realizarBusquedaNoAgencia() {
    $('#loadingSpinner').show();
    // Obtener valores de los campos del formulario
    const nombreBusqueda = document.getElementById("nombreBusqueda").value;
    const ubicacionesSelect = ciudadSeleccionada;

    // Verificar si nombreBusqueda está vacío antes de construir la URL
    const nombreBusquedaParametro = nombreBusqueda ? `&NombreBusqueda=${nombreBusqueda}` : '';

    // Construir la URL de la API con los parámetros de búsqueda
    const url = `https://redmedicaservice.devacsa.com/api/Directorios/obtenerdirectoriotaller?tipoDirectorio=NOAGENCIA&IdCiudad=${ubicacionesSelect}${nombreBusquedaParametro}&elementosporpagina=1000&paginaactual=1`;
    
    try {
    // Realizar la solicitud a la API
    fetch(url)
        .then(response => response.json())
        .then(data => {
            $('#loadingSpinner').hide();
            const resultadosDiv = document.getElementById("resultados");

            resultadosDiv.innerHTML = "";

            if (data.talleres && data.talleres.length > 0) {
                const accordion = document.createElement("div");
                accordion.classList.add("accordion", "accordion-flush");
    
                data.talleres.forEach((taller, index) => {
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

                    additionalContent.innerHTML = '<i class="fa-duotone fa-car fa-xl"></i>' + " " + (taller.ciudad ?? 'TALLER');
                    button.appendChild(additionalContent);
                
                    const contentWrapper = document.createElement("div");
                    contentWrapper.classList.add("heading-h");
                    contentWrapper.textContent = `${index + 1} - ${taller.nombre}`;
                    contentWrapper.style = "white-space: normal; word-wrap: break-word; text-align: left;";  

                    button.appendChild(contentWrapper);
                
                    header.appendChild(button);
                
                    const collapse = document.createElement("div");
                    collapse.id = `flush-collapse${index + 1}`;
                    collapse.classList.add("accordion-collapse", "collapse");
                    collapse.setAttribute("aria-labelledby", `flush-heading${index + 1}`);
                    collapse.setAttribute("data-bs-parent", "#accordionFlushExample");
    
                        // Nuevo div para la especialidad
                        const body = document.createElement("div");
                        body.classList.add("accordion-body");
                        const telefonoFijo = taller.telefonoFijo !== null && taller.telefonoFijo !== '' ? taller.telefonoFijo : 'Teléfono fijo no disponible';
                        const telefonoMovil = taller.telefonoMovil !== null && taller.telefonoMovil !== '' ? taller.telefonoMovil : 'Teléfono móvil no disponible';
                        const email = taller.email !== null && taller.email !== '' ? taller.email : 'Email no disponible';
                        const direccion = taller.direccion !== null && taller.direccion !== '' ? taller.direccion : 'Dirección no disponible';
                        body.innerHTML += `
                            <i class="fa-duotone fa-phone"></i> <a href="tel:${telefonoFijo}" class="no-link-style mb-1">${telefonoFijo}</a> <br/>
                            <i class="fa-duotone fa-mobile"></i> <a href="tel:${telefonoMovil}" class="no-link-style mb-1">${telefonoMovil}</a> <br/>
                            <i class="fa-duotone fa-envelope-open-text"></i> <a href="mailto:${email}" class="no-link-style mb-1">${email}</a> <br/>
                            <i class="fa-duotone fa-map-location-dot"></i> ${direccion} 
                            <br/>
                            <a href="ver-mas.html?id=${taller.idProveedorTaller}" target="_blank" class="btn btn-sm" style="background-color: #003a84; border-color: #003a84; color: #fff;"><i class="fa-duotone fa-arrow-right"></i> Ver más</a>
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
