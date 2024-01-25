document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('solicitudForm');

  form.addEventListener('submit', function (event) {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add('was-validated');
  });

  const duiInput = document.getElementById('dui');
  duiInput.addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9-]/g, '');
  });

  const nitInput = document.getElementById('nit');
  nitInput.addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9-]/g, '');
  });

  const tarjetaIvaInput = document.getElementById('tarjetaiva');
  tarjetaIvaInput.addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9-]/g, '');
  });

  const telefonosInput = document.getElementById('telefonos');
  telefonosInput.addEventListener('change', function () {
    const pattern = /^\d{4}-\d{4}$/;
    const phoneNumber = this.value.trim(); // Elimina espacios al principio y al final
    if (!pattern.test(phoneNumber)) {
      this.setCustomValidity('Por favor, ingrese un número de teléfono válido (ejemplo: 2222-2222)');
    } else {
      this.setCustomValidity('');
    }
  });

  const emailInput = document.getElementById('email');
  emailInput.addEventListener('input', function () {
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!pattern.test(this.value)) {
      emailInput.setCustomValidity('Por favor, ingrese una dirección de correo electrónico válida.');
    } else {
      emailInput.setCustomValidity('');
    }
  });

  /******************************** CALCULO DE LA EDAD ***********************************/

    // Obtener referencia a los elementos del DOM
    const fechaNacimientoInput = document.getElementById('fechanacimiento');
    const edadInput = document.getElementById('edad');

    // Escuchar el evento de cambio en la fecha de nacimiento
    fechaNacimientoInput.addEventListener('change', calcularEdad);

    // Función para calcular la edad
    function calcularEdad() {
        const fechaNacimiento = new Date(fechaNacimientoInput.value);
        const hoy = new Date();

        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

        // Ajustar la edad si aún no ha pasado el cumpleaños este año
        if (hoy.getMonth() < fechaNacimiento.getMonth() || (hoy.getMonth() === fechaNacimiento.getMonth() && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
        }

        // Mostrar la edad en el campo de entrada de edad
        edadInput.value = edad;
    }

  /******************************** HORARIO ***********************************/


  const lunesAperturaInput = document.getElementById('lunesApertura');
  const lunesCierreInput = document.getElementById('lunesCierre');

  // Escuchar cambios en el input del lunes
  lunesAperturaInput.addEventListener('input', function () {
    actualizarHorarios('lunes');
  });

    // Escuchar cambios en el input del lunes
    lunesCierreInput.addEventListener('input', function () {
        actualizarHorarios('lunes');
      });

  // Puedes agregar una lógica similar para el cierre si es necesario.

  function actualizarHorarios(dia) {
    const aperturaDia = document.getElementById(`${dia}Apertura`).value;
    const cierreDia = document.getElementById(`${dia}Cierre`).value;

    // Aplicar los valores a los demás días
    ['martes', 'miercoles', 'jueves', 'viernes'].forEach(otroDia => {
      document.getElementById(`${otroDia}Apertura`).value = aperturaDia;
      document.getElementById(`${otroDia}Cierre`).value = cierreDia;
    });
  }
  
/********************************************** TOKEN ***************************************** */

// page/solicitud/app.js
fetch('../../config.json')
.then(response => response.json())
.then(config => {
  // Configuraciones cargadas exitosamente, ahora hacemos la solicitud POST
  const apiEndpointToken = config.apiEndpointToken;
  const user = config.user;
  const pass = config.pass;

  // Objeto con las credenciales
  const credentials = {
    username: user,
    password: pass
  };

  // Configuración de la solicitud
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  };

  fetch(apiEndpointToken, requestOptions)
  .then(response => response.json())
  .then(data => {
    // Verificar si la respuesta contiene un token de acceso
    if (data.access_token) {
      // Almacenar el token en el sessionStorage
      sessionStorage.setItem('access_token', data.access_token);

      // Obtener el token de acceso almacenado en sessionStorage
      const accessToken = sessionStorage.getItem('access_token');

      // Verificar si el token está presente
      if (!accessToken) {
        console.error('No se encontró el token de acceso en sessionStorage.');
        return;
      }

      // Configuración de la solicitud GET
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      };

      // Realizar las solicitudes GET
      fetch('../../config.json')
        .then(response => response.json())
        .then(config => {
          const apiEndpointDev = config.apiEndpointDev;

          // Realizar la solicitud GET para obtener las configuraciones de Zonas Médicas
          const apiEndpointZonasMedicas = `${apiEndpointDev}api/Solicitud/getZonasMedicas`;
          fetch(apiEndpointZonasMedicas, requestOptions)
            .then(response => response.json())
            .then(zonasMedicas => {
              zonasMedicas.sort((a, b) => a.nomZona.localeCompare(b.nomZona));

              // Llenar el elemento select con las opciones de Zona Médica
              const zonaMedicaSelect = document.getElementById('idzonamedica');
      
              // Agregar la opción "Seleccionar Zona" al principio
              const defaultOption = document.createElement('option');
              defaultOption.value = '';
              defaultOption.textContent = 'Seleccionar Zona';
              zonaMedicaSelect.appendChild(defaultOption);
              zonasMedicas.forEach(zona => {
                const option = document.createElement('option');
                option.value = zona.idZona;
                option.textContent = zona.nomZona;
                zonaMedicaSelect.appendChild(option);
              });
            })
            .catch(error => console.error('Error en la solicitud GET para Zonas Médicas:', error));

          // Realizar la solicitud GET para obtener las configuraciones de Especialidades Médicas
          const apiEndpointEspecialidades = `${apiEndpointDev}api/Solicitud/getEspecialidadesMedicas`;
          fetch(apiEndpointEspecialidades, requestOptions)
            .then(response => response.json())
            .then(especialidades => {
              especialidades.sort((a, b) => a.nomEspecialidad.localeCompare(b.nomEspecialidad));

              // Llenar el elemento select con las opciones de Zona Médica
              const especialidadesSelect = document.getElementById('idespecialidad');
        
              // Agregar la opción "Seleccionar Zona" al principio
              const defaultOption = document.createElement('option');
              defaultOption.value = '';
              defaultOption.textContent = 'Seleccionar Especialidad';
              especialidadesSelect.appendChild(defaultOption);
              especialidades.forEach(esp => {
                const option = document.createElement('option');
                option.value = esp.idEspecialidad;
                option.textContent = esp.nomEspecialidad;
                especialidadesSelect.appendChild(option);
              });
            })
            .catch(error => console.error('Error en la solicitud GET para Especialidades Médicas:', error));
        })
        .catch(error => console.error('Error en la solicitud GET para configuraciones:', error));

    } else {
      console.error('La respuesta no contiene un token de acceso.');
    }
  })
  .catch(error => console.error('Error en la solicitud POST:', error));
})
.catch(error => console.error('Error cargando configuraciones:', error));

document.getElementById('solicitudForm').addEventListener('submit', function(event) {
  var inputFile = document.getElementById('cv');
  var filePath = inputFile.value;
  var allowedExtensions = /(\.pdf|\.docx|\.doc)$/i;

  if (!allowedExtensions.exec(filePath)) {
    inputFile.setCustomValidity('Por favor, adjunte su currículum en formato pdf o word.');
  } else {
    inputFile.setCustomValidity(''); // Restablece la validación personalizada
  }
});


const formulario = document.getElementById('solicitudForm');

formulario.addEventListener('submit', async function (event) {
event.preventDefault();

var inputFechaNacimiento = document.getElementById('fechanacimiento');
  var fechaNacimiento = new Date(inputFechaNacimiento.value);
  var hoy = new Date();
  var edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

  // Ajustar la edad si el cumpleaños aún no ha ocurrido este año
  if (hoy.getMonth() < fechaNacimiento.getMonth() || (hoy.getMonth() === fechaNacimiento.getMonth() && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
  }

  if (edad < 18) {
      inputFechaNacimiento.setCustomValidity('Debe ser mayor de 18 años.');
  } else {
      inputFechaNacimiento.setCustomValidity('');
  }

if (!form.checkValidity()) {
  // Si el formulario no es válido, muestra los mensajes de validación de Bootstrap
  event.stopPropagation();
  form.classList.add('was-validated');
  return;
}

// Verificar que todos los campos obligatorios tengan datos
const camposObligatorios = form.querySelectorAll('[required]');
for (const campo of camposObligatorios) {
  if (!campo.value.trim()) {
    // Si algún campo obligatorio está vacío, no realizar la solicitud
    form.classList.add('was-validated');
    return;
  }
}

const formObject = {};

// Recopila los campos de texto, select, teléfono y email
const camposTexto = formulario.querySelectorAll('input[type="text"], select, input[type="tel"], input[type="email"]');
camposTexto.forEach((campo) => {
  if (campo.id === 'idespecialidad' || campo.id === 'idzonamedica') {
    // Convierte el valor de la especialidad a entero
    formObject[campo.id] = parseInt(campo.value, 10);
  } else {
    formObject[campo.id] = campo.value;
  }
});

// Recopila los campos de fecha y número
const camposFechaNumero = formulario.querySelectorAll('input[type="date"], input[type="number"]');
camposFechaNumero.forEach((campo) => {
  formObject[campo.id] = campo.value;
});

// Llama a la función para obtener el horario aquí
formObject['horarios'] = obtenerHorario();

const archivoInput = document.getElementById('cv');
if (archivoInput.files.length > 0) {
  const archivo = archivoInput.files[0];

  // Utilizar una promesa para manejar la operación asíncrona
  const archivoBase64 = await readArchivoComoBase64(archivo);

  // Estructura del archivo adjunto
  const archivoAdjunto = {
    "nomarchivo": archivo.name,
    "rutabase64": archivoBase64
  };

  // Agrega el archivo adjunto al objeto
  formObject['archivosadjuntos'] = [archivoAdjunto];
}


// Realizar la solicitud GET para obtener las configuraciones
fetch('../../config.json')
.then(response => response.json())
.then(config => {
  // Construir la URL completa para el POST
  const apiEndpointDev = config.apiEndpointDev;
  const apiEndpointGuardarSolicitud = `${apiEndpointDev}api/Solicitud/guardarSolicitudRedMedica`;

  const token = sessionStorage.getItem('access_token');
  enviarSolicitudAPI(formObject, apiEndpointGuardarSolicitud, token);

})
.catch(error => console.error('Error en la solicitud GET para configuraciones:', error));


// Función para enviar la solicitud a la API
async function enviarSolicitudAPI(solicitud, endpoint, token) {
try {
const respuesta = await fetch(endpoint, {
method: 'POST',
headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + token
},
body: JSON.stringify(solicitud)
});

if (respuesta.ok) {
const resultado = await respuesta.text();
//console.log('Respuesta de la API:', resultado);

// Mostrar la respuesta en el modal
const respuestaModalBody = document.getElementById('respuestaModalBody');

// Agregar clases de Bootstrap al contenido del modal
respuestaModalBody.innerHTML = `
<div class="alert alert-light" role="alert">
  <h4 class="alert-heading">¡Solicitud Registrada Correctamente!</h4>
  <hr>
  <p class="mb-0">Número de Solicitud: #${resultado}</p>
</div>
`;

// Mostrar el modal
$('#respuestaModal').modal('show');

// Reiniciar los campos del formulario después de un breve retraso
setTimeout(() => {
  $('#respuestaModal').modal('hide');
  form.reset();
  form.classList.remove('was-validated'); // Eliminar la clase de validación
}, 10000); // Ajusta el tiempo de espera según sea necesario
} else {
console.error('Error al enviar la solicitud a la API:', respuesta.status);
// Maneja el error de acuerdo a tus necesidades
}
} catch (error) {
console.error('Error en la solicitud a la API:', error);
// Maneja el error de acuerdo a tus necesidades
}
}

});

// Función para obtener horario
function obtenerHorario() {
var dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
var horarios = {};
var cerrados = [];

dias.forEach(function (dia) {
  var cerradoCheckbox = document.getElementById(dia + 'Cerrado');
  var aperturaInput = document.getElementById(dia + 'Apertura');
  var cierreInput = document.getElementById(dia + 'Cierre');

  if (cerradoCheckbox.checked) {
    cerrados.push(dia);
  } else {
    var apertura = obtenerFormato12Horas(aperturaInput.value);
    var cierre = obtenerFormato12Horas(cierreInput.value);

    if (!horarios[apertura]) {
      horarios[apertura] = {};
    }

    if (!horarios[apertura][cierre]) {
      horarios[apertura][cierre] = [];
    }

    horarios[apertura][cierre].push(dia);
  }
});

var resultado = [];

for (var apertura in horarios) {
  for (var cierre in horarios[apertura]) {
    var diasConcatenados = horarios[apertura][cierre].join(', ');
    var horarioConcatenado = apertura + ' a ' + cierre;

    resultado.push(diasConcatenados + ' de ' + horarioConcatenado);
  }
}

if (cerrados.length > 0) {
  resultado.push('Cerrados los días: ' + cerrados.join(', '));
}

return resultado.join('\n');
}

// Función para obtener el formato de 12 horas
function obtenerFormato12Horas(hora24) {
const [hora, minutos] = hora24.split(':');
const horas12 = (hora % 12) || 12; // Convierte 0 a 12
return `${horas12}:${minutos}`;
}

$(document).ready(function() {
  $('#nit').mask('0000-000000-000-0', { placeholder: "____-______-___-_" });
});
$(document).ready(function() {
  $('#dui').mask('00000000-0', { placeholder: "________-_" });
});
$(document).ready(function() {
  $('#telefonos').mask('0000-0000', { placeholder: "____-____" });
});

// Función para leer el archivo como base64 de manera asíncrona
function readArchivoComoBase64(archivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const archivoBase64 = e.target.result;
      resolve(archivoBase64);
    };
    reader.onerror = function (error) {
      reject(error);
    };
    reader.readAsDataURL(archivo);
  });
}



});