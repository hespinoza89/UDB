/************************** Declaracion de la funcion login ************************/
function login() {
    // Obtiene los valores de usuario y contraseña
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;


    // Verifica que no existan espacion vacios
    if (username.trim() === '' || password.trim() === '') {
        document.getElementById('loginMessage').textContent = 'No se permiten campos vacios, por favor, ingresa el usuario y la contraseña';
        return;
      }

    // Verifica que usuario y pin sean correctos para desplegar sweet alert de confimación o negación
    if (username === 'Ash Ketchum' && password === '1234') {
        Swal.fire({
            title: 'Ha ingresado correctamente',
            text: 'Bienvenido, ' + username + '',
            icon: 'check',
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              // Redirecciona a la siguiente pantalla si las credenciales son correctas
              window.location.href = 'inicio.html';
            }
          });
            // Uso de localStorage
            localStorage.setItem('Ash Ketchum', username);
    } else {
        Swal.fire({
            title: 'Error de inicio de sesión',
            text: 'Nombre de usuario o contraseña incorrectos',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
    }
  }
  

// Verifica si el usuario esta seguro de cerrar su sesion para ser redireccionado a la pantalla
function cerrarSesion() {
  Swal.fire({
    title: '¿Deseas cerrar sesion?',
    text: 'Se te redirigirá a la pantalla de inicio',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      // Redirecciona a la siguiente pantalla
      window.location.href = 'Login.html';
    }
  });
}


//***************************** Funcion que despliega los diferentes formularios ***************************************/

var formularios = document.getElementsByClassName('formulario');

  function mostrarFormulario(formulario) {
    // Ocultar todos los formularios
    for (var i = 0; i < formularios.length; i++) {
      formularios[i].style.display = 'none';
    }

    // Mostrar el formulario seleccionado
    formulario.style.display = 'block';
  }


//************************** Funcion que muestra el saldo actualizado en todas las paginas *******************************/

  document.addEventListener('DOMContentLoaded', function () {
    // Obtener el saldo actual de localStorage
    var saldoActual = parseFloat(localStorage.getItem('saldo')) || 500;

    // Mostrar el saldo en la página
    document.getElementById('saldoActual').textContent = 'Saldo actual: $' + saldoActual.toFixed(2);
});



//***************************** Función para generar PDF ****************************************/
function generarPDF(saldo) {
  var doc = new jsPDF();

  // Agregar un logo o imagen de fondo
  var logo = new Image();
  logo.src = 'img/MundoPokemon.png'; // Ruta al logo

  logo.onload = function () {
      // Tamaño de la imagen (ancho y alto en mm, ajusta según el diseño)
      var imgWidth = 180; // Ancho de la imagen
      var imgHeight = 100; // Alto de la imagen

      // Posición de la imagen (x=10, y=10)
      doc.addImage(logo, 'PNG', 15, 15, imgWidth, imgHeight);

      // Ajustar posición inicial para el texto
      var startY = 15 + imgHeight + 10; // Desplaza el texto debajo de la imagen

      // Agregar texto al reporte
      doc.setFontSize(16);
      doc.text('Banco Pokémon', 20, startY);
      doc.text('Comprobante de Transacción', 20, startY + 10);

      // Agregar detalles de la transacción
      doc.setFontSize(12);
      doc.text('Cliente: Ash Ketchum', 20, startY + 30);
      doc.text('Transacción realizada exitosamente. Nuevo saldo: $' + saldo.toFixed(2), 20, startY + 60);
      doc.text('Fecha: ' + new Date().toLocaleDateString(), 20, startY + 50);

      // Descargar el PDF
      doc.save('Comprobante_Transaccion.pdf');
  };
}


//***************************** Función que deposita dinero ****************************************/
function realizarDeposito() {
// Obtener los valores de los campos
var cuenta = document.getElementById('campo1').value;
var banco = document.getElementById('campo2').value;
var cuenta2 = document.getElementById('campo3').value;
var monto = document.getElementById('montoDeposito').value;

// Validar que no haya campos vacíos
if (cuenta.trim() === '' || banco.trim() === '' || cuenta2.trim() === '' || monto.trim() === '') {
  Swal.fire({
    icon: 'error',
    title: 'Existen campos vacíos',
    text: 'Favor completar todos los campos requeridos.',
  });
  return;
}
// Validar que el monto no sea igual a 0
if (parseFloat(monto) === 0 || monto<0) {
  Swal.fire({
    icon: 'warning',
    title: 'Monto inválido',
    text: 'El monto debe ser mayor que 0.',
  });
  return;
}


// Realizar el depósito
var montoDeposito = parseFloat(monto);

// Obtener el saldo actual del localStorage
var saldoActual = parseFloat(localStorage.getItem('saldo')) || 500;

// Calcular el nuevo saldo después del depósito
var nuevoSaldo = saldoActual + montoDeposito;

// Almacenar el nuevo saldo en el localStorage
localStorage.setItem('saldo', nuevoSaldo);

// Obtener el historial de transacciones del Local Storage
var transactionHistory = JSON.parse(localStorage.getItem('transactionHistory')) || [];

// Crear un objeto para representar la transacción actual
var transaction = {
  fecha: new Date().toLocaleString(),
  tipo: 'Depósito', 
  monto: montoDeposito, 
};

// Agregar la transacción actual al historial
transactionHistory.push(transaction);

// Guardar el historial actualizado en el Local Storage
localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));

// Mostrar el nuevo saldo en la línea de texto
document.getElementById('saldoActual').textContent = 'Saldo actual: $' + nuevoSaldo.toFixed(2);

Swal.fire({
  icon: 'success',
  title: 'Depósito realizado correctamente',
  text: 'Nuevo saldo: $' + nuevoSaldo,
  footer: '<button onclick="generarPDF(' + nuevoSaldo + ')">Descargar PDF</button>',
});

// Actualizar el total de depósitos en el Local Storage
localStorage.setItem('totalDepositos', parseFloat(localStorage.getItem('totalDepositos') || 0) + montoDeposito);

// Llamar a la función para actualizar la gráfica donut
actualizarGraficaDonut();
}


//******************************** Función de retiro de dinero ***************************************/
function realizarRetiro() {
// Obtener los valores de los campos
var cuenta = document.getElementById('campo4').value;
var banco = document.getElementById('campo5').value;
var cuenta2 = document.getElementById('campo6').value;
var monto = document.getElementById('montoRetiro').value;

// Validar que no haya campos vacíos
if (cuenta.trim() === '' || banco.trim() === '' || cuenta2.trim() === '' || monto.trim() === '') {
  Swal.fire({
    icon: 'error',
    title: 'Existen campos vacíos',
    text: 'Favor completar todos los campos requeridos.',
  });
  return;
}
// Validar que el monto no sea igual a 0
if (parseFloat(monto) === 0 || monto<0) {
  Swal.fire({
    icon: 'warning',
    title: 'Monto inválido',
    text: 'El monto debe ser mayor que 0.',
  });
  return;
}

// Realizar el retiro
var montoRetiro = parseFloat(monto);

// Obtener el saldo actual del localStorage
var saldoActual = parseFloat(localStorage.getItem('saldo')) || 500;

// Verificar si hay suficiente saldo para el retiro
if (montoRetiro > saldoActual) {
  Swal.fire({
    icon: 'error',
    title: 'No hay suficiente saldo',
    text: 'No hay suficiente saldo para realizar el retiro.',
  });
  return;
}

// Calcular el nuevo saldo después del retiro
var nuevoSaldo = saldoActual - montoRetiro;

// Almacenar el nuevo saldo en el localStorage
localStorage.setItem('saldo', nuevoSaldo);

// Obtener el historial de transacciones del Local Storage
var transactionHistory = JSON.parse(localStorage.getItem('transactionHistory')) || [];

// Crear un objeto para representar la transacción actual
var transaction = {
  fecha: new Date().toLocaleString(),
  tipo: 'Retiro', 
  monto: montoRetiro, 
};

// Agregar la transacción actual al historial
transactionHistory.push(transaction);

// Guardar el historial actualizado en el Local Storage
localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));

// Mostrar el nuevo saldo en la línea de texto
document.getElementById('saldoActual').textContent = 'Saldo actual: $' + nuevoSaldo.toFixed(2);

Swal.fire({
  icon: 'success',
  title: 'Retiro realizado correctamente',
  text: 'Nuevo saldo: $' + nuevoSaldo,
  footer: '<button onclick="generarPDF(' + nuevoSaldo + ')">Descargar PDF</button>',
});

// Actualizar el total de retiros en el Local Storage
localStorage.setItem('totalRetiros', parseFloat(localStorage.getItem('totalRetiros') || 0) + montoRetiro);

// Llamar a la función para actualizar la gráfica donut
actualizarGraficaDonut();
}


//******************************* Función que muestra el saldo actual ***************************************/
function consultarSaldo() {
var saldoActual = parseFloat(localStorage.getItem('saldo')) || 500;

// Mostrar el saldo en la línea de texto
document.getElementById('saldoActual').textContent = 'Saldo actual: $' + saldoActual.toFixed(2);

Swal.fire({
  icon: 'info',
  title: 'Saldo actual',
  text: 'Saldo actual: $' + saldoActual,
  footer: '<button onclick="generarPDF(' + saldoActual + ')">Descargar PDF</button>',
});
}


//********************************** Función que paga servicios ***************************************/
function pagarServicio() {
// Obtener los valores de los campos
var servicio = document.getElementById('campo7').value;
var cuenta2 = document.getElementById('campo8').value;
var monto = document.getElementById('montoPago').value;

// Validar que no haya campos vacíos
if (servicio.trim() === '' || cuenta2.trim() === '' || monto.trim() === '') {
  Swal.fire({
    icon: 'error',
    title: 'Existen campos vacíos',
    text: 'Favor completar todos los campos requeridos.',
  });
  return;
}
// Validar que el monto no sea igual a 0
if (parseFloat(monto) === 0 || monto<0) {
  Swal.fire({
    icon: 'warning',
    title: 'Monto inválido',
    text: 'El monto debe ser mayor que 0.',
  });
  return;
}

// Realizar el pago
var montoPago = parseFloat(monto);

// Obtener el saldo actual del localStorage
var saldoActual = parseFloat(localStorage.getItem('saldo')) || 500;

// Verificar si hay suficiente saldo para el pago
if (montoPago > saldoActual) {
  Swal.fire({
    icon: 'error',
    title: 'Saldo insuficiente para realizar pago.',
    text: 'Valide que su deposito haya sido realizado.',
  });
  return;
}

// Calcular el nuevo saldo después del pago
var nuevoSaldo = saldoActual - montoPago;

// Almacenar el nuevo saldo en el localStorage
localStorage.setItem('saldo', nuevoSaldo);

// Obtener el historial de transacciones del Local Storage
var transactionHistory = JSON.parse(localStorage.getItem('transactionHistory')) || [];

// Crear un objeto para representar la transacción actual
var transaction = {
  fecha: new Date().toLocaleString(),
  tipo: 'Pago', 
  monto: montoPago,
};

// Agregar la transacción actual al historial
transactionHistory.push(transaction);

// Guardar el historial actualizado en el Local Storage
localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));

// Mostrar el nuevo saldo en la línea de texto
document.getElementById('saldoActual').textContent = 'Saldo actual: $' + nuevoSaldo.toFixed(2);

Swal.fire({
  icon: 'success',
  title: 'Pago realizado correctamente',
  text: 'Nuevo saldo: $' + nuevoSaldo,
  footer: '<button onclick="generarPDF(' + nuevoSaldo + ')">Descargar PDF</button>',
});

// Actualizar el total de pagos en el Local Storage
localStorage.setItem('totalPagos', parseFloat(localStorage.getItem('totalPagos') || 0) + montoPago);

// Llamar a la función para actualizar la gráfica donut
actualizarGraficaDonut();
}



//************************************** Inicia script que llama la funcion "mostrarHistorial"*********************************/

document.addEventListener('DOMContentLoaded', function() {
mostrarHistorial();
});
//************************************** Fin de la funcion "mostrarHistorial" ******************************************/



//********************************** Función que muestra historial ***************************************/
function mostrarHistorial() {
// Obtener el historial de transacciones del Local Storage
var transactionHistory = JSON.parse(localStorage.getItem('transactionHistory')) || [];

// Obtener la referencia a la tabla
var table = document.getElementById('transactionTable');

// Limpiar el contenido de la tabla (excepto el encabezado)
while (table.rows.length > 1) {
  table.deleteRow(1);
}

// Iterar sobre el historial de transacciones y agregar las filas a la tabla
for (var i = 0; i < transactionHistory.length; i++) {
  var transaction = transactionHistory[i];

  // Crear una nueva fila en la tabla
  var row = table.insertRow(i + 1);

  // Agregar las celdas con los datos de la transacción
  var cellNumber = row.insertCell(0);
  var cellDate = row.insertCell(1);
  var cellType = row.insertCell(2);
  var cellAmount = row.insertCell(3);

  cellNumber.textContent = i + 1; // Número de transacción
  cellDate.textContent = transaction.fecha; // Fecha
  cellType.textContent = transaction.tipo; // Tipo de transacción
  cellAmount.textContent = transaction.monto.toFixed(2); // Monto
}
}
// Llamar a la función para mostrar el historial al cargar la página
  mostrarHistorial();


//********************************** Función que borra el historial ***************************************/
function borrarHistorial() {
// Borrar el historial de transacciones del Local Storage
localStorage.removeItem('transactionHistory');

// Llamar a la función para mostrar el historial y limpiar la tabla
mostrarHistorial();
}


//*************************************** Función que genera y actualiza grafica***************************************/
function actualizarGraficaDonut() {
// Obtener los datos actualizados para la gráfica
var depositos = parseFloat(localStorage.getItem('totalDepositos')) || 0;
var retiros = parseFloat(localStorage.getItem('totalRetiros')) || 0;
var pagos = parseFloat(localStorage.getItem('totalPagos')) || 0;

// Obtener el contexto del canvas
var ctx = document.getElementById('donutChart').getContext('2d');

// Crear la gráfica donut
var donutChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Depósitos', 'Retiros', 'Pagos'],
    datasets: [{
      data: [depositos, retiros, pagos],
      backgroundColor: ['#007bff', '#28a745', '#dc3545'],
      borderColor: ['#ffffff', '#ffffff', '#Bffffff'],
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
      text: 'Estadistica de transacciones'
    },
    animation: {
      animateScale: true,
      animateRotate: true
    }
  }
});
}
actualizarGraficaDonut();


//*************************************** Función reinicia grafico y valores guardados ***************************************/ 
function reiniciarGrafico() {
// Mostrar una Sweet Alert de confirmación
Swal.fire({
  title: '¿Estás seguro?',
  text: 'Se reiniciará el gráfico y se perderán los datos actuales.',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Sí, reiniciar',
  cancelButtonText: 'Cancelar'
}).then((result) => {
  if (result.isConfirmed) {
    // Limpiar los valores almacenados en el localStorage
    localStorage.removeItem('saldo');
    localStorage.removeItem('totalDepositos');
    localStorage.removeItem('totalRetiros');
    localStorage.removeItem('totalPagos');

    // Actualizar la gráfica donut
    actualizarGraficaDonut();

    // Recargar la página
    location.reload();
  }
});
}

  