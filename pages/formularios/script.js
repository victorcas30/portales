// Función para obtener y cargar los formularios desde la API
function cargarFormulariosClasificacion() {
    
    // Realizar la petición a la API
    fetch('https://redmedicaservice.devacsa.com/api/FormulariosGenerales/getFormulariosClasificacion')
        .then(response => response.json())
        .then(data => {
            // Obtener el select de FormulariosClasificacion
            const selectFormularios = document.getElementById('selectFormularios');

            // Limpiar opciones existentes
            selectFormularios.innerHTML = '';

            // Agregar la opción "Seleccione" al principio
            const optionSeleccione = document.createElement('option');
            optionSeleccione.value = ''; // Puedes dejar el valor vacío o asignar un valor específico
            optionSeleccione.textContent = 'Categoria:';
            selectFormularios.appendChild(optionSeleccione);

            // Agregar una opción por cada formulario
            data.forEach(formulario => {
                const option = document.createElement('option');
                option.value = formulario.descripcion; // Usar la descripción como valor
                option.textContent = formulario.descripcion;
                selectFormularios.appendChild(option);
            });

            // Llamar a la función para cargar los ramos cuando se seleccione una categoría
            selectFormularios.addEventListener('change', cargarRamos);
            selectFormularios.addEventListener('change', cargarCategorias);
            selectFormularios.addEventListener('change', limpiarResultados);
        })
        .catch(error => console.error('Error al obtener los formularios:', error));
}

// Función para obtener y cargar los ramos desde la API
function cargarRamos() {
    // Obtener el valor seleccionado en el primer select (FormulariosClasificacion)
    const categoriaSeleccionada = document.getElementById('selectFormularios').value;

    // Realizar la petición a la API con el valor seleccionado
    fetch(`https://redmedicaservice.devacsa.com/api/FormulariosGenerales/getFormulariosRamo?TipoRamo=${categoriaSeleccionada}`)
        .then(response => response.json())
        .then(data => {
            // Obtener el select de FormulariosRamo
            const selectRamo = document.getElementById('selectRamo');

            // Limpiar opciones existentes
            selectRamo.innerHTML = '';

            // Agregar la opción "Ramos:" al principio
            const optionRamos = document.createElement('option');
            optionRamos.value = '';
            optionRamos.textContent = 'Ramos:';
            selectRamo.appendChild(optionRamos);

            // Agregar una opción por cada ramo
            data.forEach(ramo => {
                const option = document.createElement('option');
                option.value = ramo.codigo;
                option.textContent = ramo.descripcion;
                selectRamo.appendChild(option);
            });
            selectRamo.addEventListener('change', cargarCategorias);
            selectRamo.addEventListener('change', limpiarResultados);

        })
        .catch(error => console.error('Error al obtener los ramos:', error));
}


// Función para obtener y cargar las categorías desde la API
function cargarCategorias() {
    // Realizar la petición a la API
    fetch('https://redmedicaservice.devacsa.com/api/FormulariosGenerales/getFormulariosCategorias')
        .then(response => response.json())
        .then(data => {
            // Obtener el select de FormulariosCategorias
            const selectCategorias = document.getElementById('selectCategorias');

            // Limpiar opciones existentes
            selectCategorias.innerHTML = '';

            // Agregar la opción "Seleccione" al principio
            const optionSeleccione = document.createElement('option');
            optionSeleccione.value = '';
            optionSeleccione.textContent = 'Linea:';
            selectCategorias.appendChild(optionSeleccione);

            // Agregar una opción por cada categoría
            data.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.codigo;
                option.textContent = categoria.descripcion;
                selectCategorias.appendChild(option);
            });

            // Llamar a la función para cargar los formularios cuando se seleccione una categoría
            selectCategorias.addEventListener('change', cargarFormularios);
        })
        .catch(error => console.error('Error al obtener las categorías:', error));
}


// Función para obtener y cargar los formularios desde la API
function cargarFormularios() {
    // Obtener el valor seleccionado en el segundo select (Ramos)
    const codRamo = document.getElementById('selectRamo').value;

    // Obtener el valor seleccionado en el tercer select (Categorías)
    const codCategoria = document.getElementById('selectCategorias').value;

    // Realizar la petición a la nueva API con los valores seleccionados
    fetch(`https://redmedicaservice.devacsa.com/api/FormulariosGenerales/getFormularios?codRamo=${codRamo}&codCategoria=${codCategoria}&codGrupoRamo=0&codClasificacion=0`)
        .then(response => response.json())
        .then(data => {
            // Mostrar los formularios (puedes ajustar esta parte según tu necesidad)
            mostrarFormularios(data);
        })
        .catch(error => console.error('Error al obtener los formularios:', error));
}

// Función para mostrar los formularios (puedes ajustar esta parte según tu necesidad)
function mostrarFormularios(formularios) {
    // Obtener el elemento donde se mostrarán los formularios (cambiar el ID si es diferente)
    const resultadosFormularios = document.getElementById('resultadosFormularios');

    // Limpiar resultados existentes
    resultadosFormularios.innerHTML = '';

    // Agregar el título "Resultados de Formularios"
    const tituloFormularios = document.createElement('div');
    tituloFormularios.textContent = 'Resultados de Formularios';
    tituloFormularios.classList.add('heading-3');

    resultadosFormularios.appendChild(tituloFormularios);

    // Verificar si hay formularios
    if (formularios.length === 0) {
        // Mostrar mensaje de "Ningún Resultado" con alert info de Bootstrap
        const alertInfo = document.createElement('div');
        alertInfo.classList.add('alert', 'alert-primary');
        alertInfo.textContent = 'Ningún Resultado';
        resultadosFormularios.appendChild(alertInfo);
    } else {
        // Mostrar los formularios en el elemento con estilo de Bootstrap
        formularios.forEach(formulario => {
            // Verificar si el campo de link está vacío
            if (formulario.link.trim() !== '') {
                const card = document.createElement('div');
                card.classList.add('col-md-4', 'mb-4');

                card.innerHTML = `
                <div class="card">
                <div class="card-body d-flex align-items-center">
                    <div class="col-1">
                        <a href="${formulario.link}" target="_blank"><i class="fa-duotone fa-file-pdf fa-3x" style="color: #003a84"></i></a>
                    </div>
                    <div class="col-11 ms-4">
                        <a href="${formulario.link}" target="_blank" class="heading-h" style="white-space: normal; word-wrap: break-word;">${formulario.descripcion}</a>
                    </div>
                </div>
            </div>
            `;
                resultadosFormularios.appendChild(card);
            }
        });
    }
}

// Función para limpiar los resultados
function limpiarResultados() {
    const resultadosFormularios = document.getElementById('resultadosFormularios');
    resultadosFormularios.innerHTML = '';
}


// Llamar a las funciones para cargar los formularios y las categorías al cargar la página
cargarFormulariosClasificacion();
cargarCategorias();
cargarRamos();