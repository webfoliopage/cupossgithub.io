 // Verificación de sesión
const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

if (!currentUser || currentUser.role !== 'admin') {
  window.location.href = 'login.html';
}

// Datos de usuarios pendientes
let usuariosPendientes = JSON.parse(localStorage.getItem('usuariosPendientes')) || [];
let usuariosAprobados = JSON.parse(localStorage.getItem('usuariosAprobados')) || [];

// Clave para guardar recursos en localStorage
const recursosKey = 'recursosSistema';

// Datos iniciales de unidades de salud
const unidadesSaludIniciales = {
  "06D01": [
    { nombre: "LA GEORGINA", tipologia: "CS-A" },
    { nombre: "LOMA DE QUITO", tipologia: "CS-B" },
    { nombre: "LA PANADERIA", tipologia: "CS-A" },
    { nombre: "SANTA ROSA", tipologia: "CS-B" },
    { nombre: "BELLAVISTA", tipologia: "CS-A" },
    { nombre: "LICAN", tipologia: "CS-A" },
    { nombre: "PUNIN", tipologia: "CS-A" },
    { nombre: "LICTO", tipologia: "CS-A" },
    { nombre: "PUNGALA", tipologia: "CS-A" },
    { nombre: "CENTRO DE SALUD TIPO A FLORES", tipologia: "CS-A" },
    { nombre: "YARUQUIES", tipologia: "CS-A" },
    { nombre: "CENTRO DE SALUD N. 3", tipologia: "CS-B" },
    { nombre: "CHAMBO", tipologia: "CS-B" },
    { nombre: "LLUCUD", tipologia: "CS-A" },
    { nombre: "QUIMIAG", tipologia: "CS-A" },
    { nombre: "CUBIJIES", tipologia: "CS-A" },
    { nombre: "SAN JUAN", tipologia: "CS-A" },
    { nombre: "CALPI", tipologia: "CS-B" },
    { nombre: "SAN LUIS", tipologia: "CS-A" },
    { nombre: "CENTRO DE SALUD N. 1", tipologia: "CS-B" },
    { nombre: "CENTRO DE SALUD TIPO C LIZARZABURU", tipologia: "CS-C" }
  ],
  "06D02": [
    { nombre: "CUMANDA", tipologia: "CS-B" },
    { nombre: "MULTITUD", tipologia: "CS-A" },
    { nombre: "PALLATANGA", tipologia: "CS-B" },
    { nombre: "ACHUPALLAS", tipologia: "CS-B" },
    { nombre: "GUASUNTOS", tipologia: "CS-A" },
    { nombre: "NIZAG", tipologia: "CS-A" },
    { nombre: "HUIGRA", tipologia: "CS-A" },
    { nombre: "SEVILLA", tipologia: "CS-A" },
    { nombre: "SIBAMBE", tipologia: "CS-A" },
    { nombre: "TIXAN", tipologia: "CS-A" },
    { nombre: "GONZOL", tipologia: "CS-A" },
    { nombre: "CAPZOL", tipologia: "CS-A" },
    { nombre: "COMPUD", tipologia: "CS-A" },
    { nombre: "JOYAGSHI", tipologia: "CS-A" },
    { nombre: "LLAGOS", tipologia: "CS-A" },
    { nombre: "CENTRO DE SALUD DE CHUNCHI", tipologia: "CS-A" },
    { nombre: "CENTRO DE SALUD DE ALAUSI", tipologia: "CS-A" }
  ],
  "06D04": [
    { nombre: "SANTIAGO DE QUITO", tipologia: "CS-A" },
    { nombre: "COLUMBE", tipologia: "CS-A" },
    { nombre: "SAN GUISEL", tipologia: "CS-A" },
    { nombre: "JUAN DE VELASCO", tipologia: "CS-A" },
    { nombre: "CEBADAS", tipologia: "CS-A" },
    { nombre: "PALMIRA", tipologia: "CS-A" },
    { nombre: "JATUMPAMBA", tipologia: "CS-A" },
    { nombre: "PENIPE", tipologia: "CS-B" },
    { nombre: "ILAPO", tipologia: "CS-A" },
    { nombre: "SAN ANDRES", tipologia: "CS-A" },
    { nombre: "CHOCAVI", tipologia: "CS-A" },
    { nombre: "TUNTATACTO", tipologia: "CS-A" },
    { nombre: "GUANO", tipologia: "CS-B" },
    { nombre: "SAN GERARDO", tipologia: "CS-A" },
    { nombre: "CENTRO DE SALUD DE GUAMOTE", tipologia: "CS-A" },
    { nombre: "CENTRO DE SALUD DE COLTA", tipologia: "CS-A" }
  ],
  "05D01": [
    { nombre: "JOSE GUANGO ALTO", tipologia: "CS-A" },
    { nombre: "POALO", tipologia: "CS-A" },
    { nombre: "LASSO", tipologia: "CS-C" },
    { nombre: "TOACASO", tipologia: "CS-A" },
    { nombre: "11 DE NOVIEMBRE", tipologia: "CS-A" },
    { nombre: "LATACUNGA", tipologia: "CS-C" },
    { nombre: "PATUTAN", tipologia: "CS-B" },
    { nombre: "SAN BUENAVENTURA", tipologia: "CS-B" },
    { nombre: "BELISARIO QUEVEDO", tipologia: "CS-A" },
    { nombre: "ALAQUEZ", tipologia: "CS-A" },
    { nombre: "MULALO", tipologia: "CS-A" },
    { nombre: "JOSE GUANGO BAJO", tipologia: "CS-A" },
    { nombre: "PALOPO", tipologia: "CS-A" },
    { nombre: "LOMA GRANDE", tipologia: "CS-A" }
  ],
  "05D03": [
    { nombre: "MORASPUNGO", tipologia: "CS-B" },
    { nombre: "PIEDADCITA", tipologia: "CS-A" },
    { nombre: "RAMON CAMPAÑA", tipologia: "CS-A" },
    { nombre: "PINLLOPATA", tipologia: "CS-A" },
    { nombre: "CENTRO DE SALUD LA MANA", tipologia: "CS-C" },
    { nombre: "CHIPEHAMBURGO", tipologia: "CS-A" },
    { nombre: "GUASAGANDA", tipologia: "CS-A" },
    { nombre: "PUCAYACU", tipologia: "CS-A" },
    { nombre: "EL CORAZON", tipologia: "CS-A" }
  ],
  "05D04": [
    { nombre: "PILALO", tipologia: "CS-A" },
    { nombre: "EL TINGO (LA ESPERANZA)", tipologia: "CS-A" },
    { nombre: "CENTRO DE SALUD SAQUISILI", tipologia: "CS-C" },
    { nombre: "SIGCHOS", tipologia: "CS-A" },
    { nombre: "CANCHAGUA", tipologia: "CS-A" },
    { nombre: "CHUGCHILLAN", tipologia: "CS-A" },
    { nombre: "ISINLIVI", tipologia: "CS-A" },
    { nombre: "ANGAMARCA", tipologia: "CS-A" },
    { nombre: "GUANGAJE", tipologia: "CS-A" },
    { nombre: "LA VICTORIA", tipologia: "CS-A" },
    { nombre: "YACUMBAMBA", tipologia: "CS-A" },
    { nombre: "LAS PAMPAS", tipologia: "CS-A" },
    { nombre: "PUJILI", tipologia: "CS-A" },
    { nombre: "ZUMBAHUA", tipologia: "CS-B" }
  ],
  "05D06": [
    { nombre: "YANAYACU", tipologia: "CS-A" },
    { nombre: "ANTONIO JOSE HOLGUIN", tipologia: "CS-A" },
    { nombre: "CUSUBAMBA", tipologia: "CS-A" },
    { nombre: "MULLIQUINDIL (SANTA ANA)", tipologia: "CS-A" },
    { nombre: "PANZALEO", tipologia: "CS-A" },
    { nombre: "PAPAHURCO", tipologia: "CS-A" },
    { nombre: "ANCHILIVI", tipologia: "CS-A" },
    { nombre: "MULALILLO", tipologia: "CS-A" },
    { nombre: "SAN MARCOS", tipologia: "CS-A" },
    { nombre: "SALCEDO", tipologia: "CS-B" }
  ],
  "16D01": [
    { nombre: "CHUWITAYU", tipologia: "CS-A" },
    { nombre: "BELLAVISTA", tipologia: "CS-A" },
    { nombre: "CENTRO DE SALUD URBANO PUYO", tipologia: "CS-A" },
    { nombre: "10 DE AGOSTO", tipologia: "CS-A" },
    { nombre: "EL TRIUNFO", tipologia: "CS-A" },
    { nombre: "FATIMA", tipologia: "CS-A" },
    { nombre: "TENIENTE HUGO ORTIZ", tipologia: "CS-A" },
    { nombre: "VERACRUZ", tipologia: "CS-A" },
    { nombre: "CABECERAS DEL BOBONAZA", tipologia: "CS-A" },
    { nombre: "SANTA CLARA", tipologia: "CS-A" },
    { nombre: "SAN JORGE", tipologia: "CS-A" },
    { nombre: "CANELOS", tipologia: "CS-A" },
    { nombre: "MUSULLACTA (SIMON BOLIVAR)", tipologia: "CS-A" },
    { nombre: "PITIRISHCA", tipologia: "CS-A" },
    { nombre: "TARQUI", tipologia: "CS-A" },
    { nombre: "MERA", tipologia: "CS-A" },
    { nombre: "SHELL", tipologia: "CS-A" },
    { nombre: "MADRE TIERRA", tipologia: "CS-A" },
    { nombre: "KUMAY", tipologia: "CS-A" },
    { nombre: "LOS ANGELES", tipologia: "CS-A" },
    { nombre: "COPATAZA", tipologia: "CS-A" },
    { nombre: "MONTALVO", tipologia: "CS-A" },
    { nombre: "PACAYACU", tipologia: "CS-A" },
    { nombre: "SARAYACU", tipologia: "CS-A" },
    { nombre: "MORETE PUYO", tipologia: "CS-A" }
  ],
  "18D02": [
    { nombre: "CUNCHIBAMBA", tipologia: "CS-A" },
    { nombre: "QUISAPINCHA", tipologia: "CS-A" },
    { nombre: "PASA", tipologia: "CS-B" },
    { nombre: "CENTRO DE SALUD DE YATZAPUTZAN", tipologia: "CS-A" },
    { nombre: "CENTRO DE SALUD DE PILAHUIN", tipologia: "CS-B" },
    { nombre: "CENTRO DE SALUD JUAN BENIGNO VELA", tipologia: "CS-A" },
    { nombre: "CENTRO DE SALUD HUACHI GRANDE", tipologia: "CS-A" },
    { nombre: "CENTRO DE SALUD PICAIHUA", tipologia: "CS-A" },
    { nombre: "CENTRO DE SALUD DE TOTORAS", tipologia: "CS-B" },
    { nombre: "AMBATILLO", tipologia: "CS-A" },
    { nombre: "AUGUSTO N. MARTINEZ", tipologia: "CS-A" },
    { nombre: "SAN JOSE DE ANGAHUANA", tipologia: "CS-A" },
    { nombre: "ATAHUALPA", tipologia: "CS-A" },
    { nombre: "CENTRO DE SALUD HUACHI CHICO", tipologia: "CS-A" },
    { nombre: "CENTRO DE SALUD Nº 3", tipologia: "CS-B" },
    { nombre: "CENTRO DE SALUD Nº 2", tipologia: "CS-C" },
    { nombre: "VICENTINA", tipologia: "CS-A" },
    { nombre: "LA PENINSULA", tipologia: "CS-A" },
    { nombre: "CENTRO DE SALUD N. 1", tipologia: "CS-B" },
    { nombre: "IZAMBA", tipologia: "CS-A" },
    { nombre: "CENTRO DE SALUD DE SANTA ROSA", tipologia: "CS-B" }
  ],
  "18D04": [
    { nombre: "RIO VERDE", tipologia: "CS-A" },
    { nombre: "SAN JOSE DE POALO", tipologia: "CS-A" },
    { nombre: "PRESIDENTE URBINA", tipologia: "CS-A" },
    { nombre: "SAN MIGUELITO", tipologia: "CS-A" },
    { nombre: "CHIQUICHA", tipologia: "CS-A" },
    { nombre: "SALASACA", tipologia: "CS-B" },
    { nombre: "TISALEO", tipologia: "CS-A" },
    { nombre: "ALOBAMBA", tipologia: "CS-A" },
    { nombre: "CEVALLOS", tipologia: "CS-B" },
    { nombre: "QUINCHICOTO", tipologia: "CS-A" },
    { nombre: "PINGUILI STO.DOMINGO", tipologia: "CS-A" },
    { nombre: "CENTRO DE SALUD QUERO", tipologia: "CS-C" },
    { nombre: "MOCHA", tipologia: "CS-A" },
    { nombre: "YANAHURCO", tipologia: "CS-A" },
    { nombre: "COTALO", tipologia: "CS-A" },
    { nombre: "HUAMBALO", tipologia: "CS-B" },
    { nombre: "SANTA RITA", tipologia: "CS-A" },
    { nombre: "SAN ANDRES", tipologia: "CS-A" },
    { nombre: "HUAPANTE", tipologia: "CS-A" },
    { nombre: "HUALCANGA SANTA ANITA", tipologia: "CS-A" },
    { nombre: "RIO NEGRO", tipologia: "CS-A" },
    { nombre: "EL TRIUNFO", tipologia: "CS-A" },
    { nombre: "PATATE", tipologia: "CS-B" },
    { nombre: "SUCRE", tipologia: "CS-A" },
    { nombre: "CENTRO DE SALUD DE PELILEO", tipologia: "CS-A" },
    { nombre: "CENTRO DE SALUD DE PILLARO", tipologia: "CS-A" },
    { nombre: "CENTRO DE SALUD BAÑOS", tipologia: "CS-A" },
    { nombre: "CENTRO DE SALUD TIPO A GARCIA MORENO - CHUMAQUI", tipologia: "CS-A" }
  ]
};

// Función para cargar recursos
function cargarRecursos() {
  const recursosGuardados = localStorage.getItem(recursosKey);
  if (recursosGuardados) {
    return JSON.parse(recursosGuardados);
  }
  
  // Datos por defecto
  return {
    universidades: [
      "UNIVERSIDAD INDOAMERICA",
      "UNIVERSIDAD TÉCNICA DE AMBATO",
      "UNACH",
      "UTA",
      "PUCE",
      "ESPOCH",
      "JATUN YACHAY WASI"
    ],
    carreras: [
      { codigo: "PSICOLOGIA", nombre: "Psicología" },
      { codigo: "LABORATORIO CLINICO", nombre: "Laboratorio Clínico" },
      { codigo: "ENFERMERIA", nombre: "Enfermería" },
      { codigo: "TECNICOS EN ENFERMERIA", nombre: "Técnicos en Enfermería" },
      { codigo: "TECNICOS EN REHABILITACION", nombre: "Técnicos en Rehabilitación" },
      { codigo: "TECNICOS EN LABORATORIO", nombre: "Técnicos en Laboratorio" },
      { codigo: "APH", nombre: "APH" },
      { codigo: "AUXILIAR EN ENFERMERIA", nombre: "Auxiliar en Enfermería" },
      { codigo: "MEDICINA", nombre: "Medicina" },
      { codigo: "FISIOTERAPIA", nombre: "Fisioterapia" },
      { codigo: "NUTRICION", nombre: "Nutrición" },
      { codigo: "BIOQUIMICA", nombre: "Bioquímica" },
      { codigo: "AUXILIAR DE FARMACIA", nombre: "Auxiliar de Farmacia" },
      { codigo: "ODONTOLOGIA", nombre: "Odontología" }
    ],
    distritos: [
      { codigo: "06D01", nombre: "06D01 ZONA" },
      { codigo: "06D02", nombre: "06D02 ALAUSI CHUNCHI" },
      { codigo: "06D04", nombre: "06D04 COLTA GUAMOTE" },
      { codigo: "05D01", nombre: "05D01 LATACUNGA" },
      { codigo: "05D03", nombre: "05D03 PANGUA LA MANA" },
      { codigo: "05D04", nombre: "05D04 PUJILI SAQUISILI" },
      { codigo: "05D06", nombre: "05D06 SALCEDO" },
      { codigo: "16D01", nombre: "16D01 PASTAZA" },
      { codigo: "18D02", nombre: "18D02 AMBATO" },
      { codigo: "18D04", nombre: "18D04 PATATE PELILEO" }
    ],
    unidadesSalud: unidadesSaludIniciales
  };
}

// Función para guardar recursos
function guardarRecursos(recursos) {
  localStorage.setItem(recursosKey, JSON.stringify(recursos));
}

// Inicializar recursos
let recursos = cargarRecursos();

// Función para cargar universidades
function cargarUniversidades() {
  const lista = document.getElementById('lista-universidades');
  const selectInstituciones = document.getElementById('institucionSolicitante');
  
  // Limpiar select
  selectInstituciones.innerHTML = '<option value="">Seleccione una institución</option>';
  lista.innerHTML = '';
  
  // Llenar select y lista con datos de recursos
  recursos.universidades.forEach(uni => {
    // Agregar al select
    const option = document.createElement('option');
    option.value = uni;
    option.textContent = uni;
    selectInstituciones.appendChild(option);
    
    // Agregar a la lista de administración
    lista.innerHTML += `
      <div class="resource-item">
        <span>${uni}</span>
        <button class="delete-btn" onclick="eliminarUniversidad('${uni}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
  });
}

// Función para agregar universidad
function agregarUniversidad() {
  const input = document.getElementById('nueva-universidad');
  const nombre = input.value.trim();
  
  if (!nombre) {
    alert('Por favor ingrese un nombre de universidad');
    return;
  }
  
  // Verificar si ya existe
  if (recursos.universidades.includes(nombre)) {
    alert('Esta universidad ya existe');
    return;
  }
  
  // Agregar a los recursos
  recursos.universidades.push(nombre);
  guardarRecursos(recursos);
  
  // Actualizar UI
  input.value = '';
  cargarUniversidades();
  alert('Universidad agregada correctamente');
}

// Función para eliminar universidad
function eliminarUniversidad(nombre) {
  if (!confirm(`¿Está seguro de eliminar la universidad "${nombre}"?`)) return;
  
  // Eliminar de los recursos
  recursos.universidades = recursos.universidades.filter(uni => uni !== nombre);
  guardarRecursos(recursos);
  
  // Actualizar UI
  cargarUniversidades();
  alert('Universidad eliminada correctamente');
}

// Función para cargar carreras
function cargarCarreras() {
  const lista = document.getElementById('lista-carreras-admin');
  const selectCarreras = document.getElementById('carrera');
  const listaCarrerasSidebar = document.querySelector('.lista-carreras');
  
  // Limpiar selects y lista
  selectCarreras.innerHTML = '<option value="">Seleccione una carrera</option>';
  listaCarrerasSidebar.innerHTML = '';
  lista.innerHTML = '';
  
  // Llenar selects y lista con datos de recursos
  recursos.carreras.forEach(carrera => {
    // Agregar al select principal
    const option = document.createElement('option');
    option.value = carrera.codigo;
    option.textContent = carrera.nombre;
    selectCarreras.appendChild(option);
    
    // Agregar al sidebar
    const li = document.createElement('li');
    li.textContent = carrera.nombre;
    li.setAttribute('data-carrera', carrera.codigo);
    li.addEventListener('click', function() {
      seleccionarCarrera(this);
    });
    listaCarrerasSidebar.appendChild(li);
    
    // Agregar a la lista de administración
    lista.innerHTML += `
      <div class="resource-item">
        <span>${carrera.nombre} (${carrera.codigo})</span>
        <button class="delete-btn" onclick="eliminarCarrera('${carrera.codigo}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
  });
}

// Función para agregar carrera
function agregarCarrera() {
  const input = document.getElementById('nueva-carrera');
  const nombre = input.value.trim();
  
  if (!nombre) {
    alert('Por favor ingrese un nombre de carrera');
    return;
  }
  
  const codigo = nombre.toUpperCase().replace(/ /g, '_');
  
  // Verificar si ya existe
  if (recursos.carreras.some(c => c.codigo === codigo)) {
    alert('Esta carrera ya existe');
    return;
  }
  
  // Agregar a los recursos
  recursos.carreras.push({ codigo, nombre });
  guardarRecursos(recursos);
  
  // Actualizar UI
  input.value = '';
  cargarCarreras();
  alert('Carrera agregada correctamente');
}

// Función para eliminar carrera
function eliminarCarrera(codigo) {
  const carrera = recursos.carreras.find(c => c.codigo === codigo);
  if (!carrera) return;
  
  if (!confirm(`¿Está seguro de eliminar la carrera "${carrera.nombre}"?`)) return;
  
  // Eliminar de los recursos
  recursos.carreras = recursos.carreras.filter(c => c.codigo !== codigo);
  guardarRecursos(recursos);
  
  // Actualizar UI
  cargarCarreras();
  alert('Carrera eliminada correctamente');
}

// Función para cargar distritos
function cargarDistritos() {
  const lista = document.getElementById('lista-distritos');
  const selectDistritos = document.getElementById('distritoAsignado');
  
  // Limpiar select
  selectDistritos.innerHTML = '<option value="">Seleccione un distrito</option>';
  lista.innerHTML = '';
  
  // Llenar select y lista con datos de recursos
  recursos.distritos.forEach(distrito => {
    // Agregar al select
    const option = document.createElement('option');
    option.value = distrito.codigo;
    option.textContent = distrito.nombre;
    selectDistritos.appendChild(option);
    
    // Agregar a la lista de administración
    lista.innerHTML += `
      <div class="resource-item">
        <span>${distrito.nombre} (${distrito.codigo})</span>
        <button class="delete-btn" onclick="eliminarDistrito('${distrito.codigo}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
  });
}

// Función para agregar distrito
function agregarDistrito() {
  const inputCodigo = document.getElementById('nuevo-distrito-codigo');
  const inputNombre = document.getElementById('nuevo-distrito-nombre');
  const codigo = inputCodigo.value.trim();
  const nombre = inputNombre.value.trim();
  
  if (!codigo || !nombre) {
    alert('Por favor ingrese ambos campos: código y nombre del distrito');
    return;
  }
  
  // Verificar si ya existe
  if (recursos.distritos.some(d => d.codigo === codigo)) {
    alert('Este distrito ya existe');
    return;
  }
  
  // Agregar a los recursos
  recursos.distritos.push({ codigo, nombre });
  
  // Crear entrada vacía para unidades de salud
  if (!recursos.unidadesSalud[codigo]) {
    recursos.unidadesSalud[codigo] = [];
  }
  
  guardarRecursos(recursos);
  
  // Actualizar UI
  inputCodigo.value = '';
  inputNombre.value = '';
  cargarDistritos();
  cargarDistritosParaUnidades();
  alert('Distrito agregado correctamente');
}

// Función para eliminar distrito
function eliminarDistrito(codigo) {
  const distrito = recursos.distritos.find(d => d.codigo === codigo);
  if (!distrito) return;
  
  if (!confirm(`¿Está seguro de eliminar el distrito "${distrito.nombre}"?`)) return;
  
  // Eliminar de los recursos
  recursos.distritos = recursos.distritos.filter(d => d.codigo !== codigo);
  delete recursos.unidadesSalud[codigo];
  guardarRecursos(recursos);
  
  // Actualizar UI
  cargarDistritos();
  cargarDistritosParaUnidades();
  alert('Distrito eliminado correctamente');
}

// Función para cargar distritos en el select de unidades de salud
function cargarDistritosParaUnidades() {
  const select = document.getElementById('distrito-unidad-salud');
  select.innerHTML = '<option value="">Seleccione un distrito</option>';
  
  recursos.distritos.forEach(distrito => {
    const option = document.createElement('option');
    option.value = distrito.codigo;
    option.textContent = distrito.nombre;
    select.appendChild(option);
  });
}

// Función para cargar unidades de salud
function cargarUnidadesDeSalud(distrito) {
  const lista = document.getElementById('lista-unidades-salud');
  
  if (!distrito || !recursos.unidadesSalud[distrito]) {
    lista.innerHTML = '<div class="empty-state">Seleccione un distrito para ver sus unidades de salud</div>';
    return;
  }
  
  lista.innerHTML = recursos.unidadesSalud[distrito].map(unidad => `
    <div class="resource-item">
      <span>${unidad.nombre} (${unidad.tipologia})</span>
      <button class="delete-btn" onclick="eliminarUnidadSalud('${distrito}', '${unidad.nombre}')">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join('');
}

// Función para agregar unidad de salud
function agregarUnidadSalud() {
  const select = document.getElementById('distrito-unidad-salud');
  const inputNombre = document.getElementById('nueva-unidad-salud');
  const inputTipologia = document.getElementById('tipologia-unidad-salud');
  
  const distrito = select.value;
  const nombre = inputNombre.value.trim();
  const tipologia = inputTipologia.value.trim();
  
  if (!distrito || !nombre || !tipologia) {
    alert('Por favor complete todos los campos');
    return;
  }
  
  // Verificar si ya existe
  if (recursos.unidadesSalud[distrito].some(u => u.nombre === nombre)) {
    alert('Esta unidad de salud ya existe en el distrito seleccionado');
    return;
  }
  
  // Agregar a los recursos
  recursos.unidadesSalud[distrito].push({ nombre, tipologia });
  guardarRecursos(recursos);
  
  // Actualizar UI
  inputNombre.value = '';
  inputTipologia.value = '';
  cargarUnidadesDeSalud(distrito);
  alert('Unidad de salud agregada correctamente');
}

// Función para eliminar unidad de salud
function eliminarUnidadSalud(distrito, nombre) {
  if (!confirm(`¿Está seguro de eliminar la unidad de salud "${nombre}"?`)) return;
  
  // Eliminar de los recursos
  recursos.unidadesSalud[distrito] = recursos.unidadesSalud[distrito].filter(u => u.nombre !== nombre);
  guardarRecursos(recursos);
  
  // Actualizar UI
  cargarUnidadesDeSalud(distrito);
  alert('Unidad de salud eliminada correctamente');
}

// Función para cargar unidades de salud según el distrito seleccionado (para el formulario principal)
function cargarUnidadesSalud() {
  const distritoSelect = document.getElementById('distritoAsignado');
  const unidadSaludSelect = document.getElementById('unidadSalud');
  
  const distritoSeleccionado = distritoSelect.value;
  
  unidadSaludSelect.innerHTML = '<option value="">Seleccione una unidad de salud</option>';
  
  if (distritoSeleccionado && recursos.unidadesSalud[distritoSeleccionado]) {
    unidadSaludSelect.disabled = false;
    
    recursos.unidadesSalud[distritoSeleccionado].forEach(unidad => {
      const option = document.createElement('option');
      option.value = `${unidad.nombre} (${unidad.tipologia})`;
      option.textContent = `${unidad.nombre} (${unidad.tipologia})`;
      unidadSaludSelect.appendChild(option);
    });
  } else {
    unidadSaludSelect.disabled = true;
  }
}

// Función guardarDatos modificada
function guardarDatos(datos) {
  const datosActuales = JSON.parse(localStorage.getItem('pasantiasData')) || [];
  const datosConInscritos = datos.map(nuevo => {
    const existente = datosActuales.find(item => item.id === nuevo.id);
    return {
      ...nuevo,
      estudiantes_inscritos: existente ? existente.estudiantes_inscritos || 0 : 0
    };
  });

  localStorage.setItem('pasantiasData', JSON.stringify(datosConInscritos));
  
  const event = new CustomEvent('pasantiasDataUpdated', {
    detail: { data: datosConInscritos }
  });
  window.dispatchEvent(event);
}

// Funciones para localStorage
function obtenerDatos() {
  const datosGuardados = localStorage.getItem('pasantiasData');
  if (datosGuardados) {
    return JSON.parse(datosGuardados);
  }
  return [];
}

// Variables globales
let todosLosDatos = obtenerDatos();
let carreraSeleccionada = null;

// Función para normalizar nombres de tutores
function normalizarNombreTutor(nombre) {
  if (!nombre) return '';
  const nombreSinTitulo = nombre.replace(/^(Dr\.?|Dra\.?|Lic\.?|Ing\.?)\s*/i, '');
  return nombreSinTitulo.trim().toLowerCase();
}

// Función para verificar si un tutor ya está asignado
function tutorYaAsignado(tutor, universidad, idExcluir = null) {
  const tutorNormalizado = normalizarNombreTutor(tutor);
  return todosLosDatos.some(item => {
    if (idExcluir && item.id === idExcluir) return false;
    return normalizarNombreTutor(item.tutor_academico) === tutorNormalizado && 
           item.institucion_solicitante.toUpperCase() === universidad.toUpperCase();
  });
}

// Función para obtener la universidad del tutor
function obtenerUniversidadTutor(tutor) {
  const tutorNormalizado = normalizarNombreTutor(tutor);
  const registro = todosLosDatos.find(item => 
    normalizarNombreTutor(item.tutor_academico) === tutorNormalizado
  );
  return registro ? registro.institucion_solicitante : null;
}

// Función para mostrar usuarios pendientes de aprobación
function mostrarUsuariosPendientes() {
  const usuariosPendientes = JSON.parse(localStorage.getItem('usuariosPendientes')) || [];
  const contenedor = document.getElementById('usuarios-pendientes');
  const badge = document.getElementById('pending-users-badge');
  
  badge.textContent = usuariosPendientes.length;
  
  if (usuariosPendientes.length === 0) {
    contenedor.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-users"></i>
        <p>No hay solicitudes pendientes</p>
      </div>
    `;
    return;
  }

  let html = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Fecha Registro</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>`;

  usuariosPendientes.forEach(usuario => {
    html += `
      <tr>
        <td>${usuario.username || '-'}</td>
        <td>${usuario.email || '-'}</td>
        <td>${usuario.role || '-'}</td>
        <td>${formatearFecha(usuario.createdAt)}</td>
        <td class="action-buttons">
          <div class="approve-actions">
            <select id="rol-usuario-${usuario.email}" class="role-select">
              <option value="user">Usuario Normal</option>
              <option value="admin">Administrador</option>
            </select>
            <button class="edit-btn" onclick="aprobarUsuario('${usuario.email}')">
              <i class="fas fa-check"></i> Aprobar
            </button>
            <button class="delete-btn" onclick="rechazarUsuario('${usuario.email}')">
              <i class="fas fa-times"></i> Rechazar
            </button>
          </div>
        </td>
      </tr>`;
  });

  html += `</tbody></table>`;
  contenedor.innerHTML = html;
}

// Función para aprobar un usuario con selección de rol
function aprobarUsuario(email, rol) {
  const usuariosPendientes = JSON.parse(localStorage.getItem('usuariosPendientes')) || [];
  const usuarios = JSON.parse(localStorage.getItem('users')) || [];
  
  // Obtener el rol seleccionado
  const rolSeleccionado = document.getElementById(`rol-usuario-${email}`)?.value || rol || 'user';
  
  const usuarioIndex = usuariosPendientes.findIndex(u => u.email === email);
  if (usuarioIndex === -1) return;

  const usuario = usuariosPendientes[usuarioIndex];
  
  // Actualizar estado en la lista de usuarios
  const usuarioPrincipalIndex = usuarios.findIndex(u => u.email === email);
  if (usuarioPrincipalIndex !== -1) {
    usuarios[usuarioPrincipalIndex].status = 'approved';
    usuarios[usuarioPrincipalIndex].approvedBy = currentUser.username;
    usuarios[usuarioPrincipalIndex].role = rolSeleccionado;
    localStorage.setItem('users', JSON.stringify(usuarios));
  }

  // Mover de pendientes a aprobados
  usuariosPendientes.splice(usuarioIndex, 1);
  localStorage.setItem('usuariosPendientes', JSON.stringify(usuariosPendientes));

  // Mostrar mensaje y actualizar vista
  alert(`Usuario ${usuario.username} aprobado como ${rolSeleccionado === 'admin' ? 'Administrador' : 'Usuario Normal'}`);
  mostrarUsuariosPendientes();
}

// Función para rechazar un usuario
function rechazarUsuario(email) {
  if (!confirm('¿Está seguro de rechazar esta solicitud?')) return;

  const usuariosPendientes = JSON.parse(localStorage.getItem('usuariosPendientes')) || [];
  const usuarios = JSON.parse(localStorage.getItem('users')) || [];
  
  // Eliminar de pendientes
  const nuevosPendientes = usuariosPendientes.filter(u => u.email !== email);
  localStorage.setItem('usuariosPendientes', JSON.stringify(nuevosPendientes));
  
  // Eliminar de usuarios principales
  const nuevosUsuarios = usuarios.filter(u => u.email !== email);
  localStorage.setItem('users', JSON.stringify(nuevosUsuarios));

  alert('Solicitud rechazada correctamente');
  mostrarUsuariosPendientes();
}

// Funciones de utilidad
function formatearFecha(fechaStr) {
  if (!fechaStr) return '-';
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString('es-ES');
}

function formatearEstado(estado) {
  const estados = {
    'disponible': 'Disponible',
    'parcial': 'Disponibilidad Parcial',
    'no_disponible': 'No Disponible'
  };
  return estados[estado] || estado || 'Desconocido';
}

function formatearCarrera(carrera) {
  const carreraObj = recursos.carreras.find(c => c.codigo === carrera);
  return carreraObj ? carreraObj.nombre : carrera;
}

function validarLongitud(input, maxLength) {
  if (input.value.length > maxLength) {
    input.value = input.value.slice(0, maxLength);
  }
}

function guardarRegistro(e) {
  e.preventDefault();
  
  const tutor = document.getElementById('tutor').value;
  const universidad = document.getElementById('institucionSolicitante').value;
  const carrera = document.getElementById('carrera').value;

  if (tutor) {
    const tutorRepetido = todosLosDatos.find(item => 
      normalizarNombreTutor(item.tutor_academico) === normalizarNombreTutor(tutor)
    );

    if (tutorRepetido) {
      alert(`❌ Error: El tutor "${tutor}" ya está asignado a:\n\n• Institución: ${tutorRepetido.institucion_solicitante}\n• Carrera: ${formatearCarrera(tutorRepetido.carrera)}\n\nUn tutor solo puede estar en UNA institución.`);
      return;
    }
  }

  const nuevoRegistro = {
    id: Date.now(),
    institucion_solicitante: universidad,
    carrera: carrera,
    distrito_asignado: document.getElementById('distritoAsignado').value,
    unidad_salud: document.getElementById('unidadSalud').value,
    horas: parseInt(document.getElementById('horas').value),
    semestre: document.getElementById('semestre').value,
    fecha_inicio: document.getElementById('fechaInicio').value,
    fecha_final: document.getElementById('fechaFin').value,
    numero_estudiantes: parseInt(document.getElementById('estudiantes').value),
    servicio: document.getElementById('servicio').value,
    tutor_academico: tutor,
    estado: document.getElementById('disponibilidad-tutor').value,
    observaciones: document.getElementById('observaciones').value,
    estudiantes_inscritos: 0
  };

  todosLosDatos.push(nuevoRegistro);
  guardarDatos(todosLosDatos);
  
  alert('✅ Registro guardado correctamente');
  document.getElementById('registroForm').reset();
  
  if (carreraSeleccionada === nuevoRegistro.carrera.toUpperCase()) {
    const elementoCarrera = document.querySelector(`.lista-carreras li[data-carrera="${carreraSeleccionada}"]`);
    filtrarPorCarrera(carreraSeleccionada, elementoCarrera.textContent);
  }
  
  mostrarSeccion('registros');
}

function editarRegistro(id) {
  const registro = todosLosDatos.find(item => item.id == id);
  if (!registro) return;
  
  document.getElementById('distritoAsignado').value = registro.distrito_asignado || '';
  
  if (registro.distrito_asignado) {
    cargarUnidadesSalud();
    
    setTimeout(() => {
      document.getElementById('unidadSalud').value = registro.unidad_salud || '';
    }, 100);
  }

  document.getElementById('institucionSolicitante').value = registro.institucion_solicitante || '';
  document.getElementById('carrera').value = registro.carrera || '';
  document.getElementById('horas').value = registro.horas || '';
  document.getElementById('semestre').value = registro.semestre || '';
  document.getElementById('fechaInicio').value = registro.fecha_inicio || '';
  document.getElementById('fechaFin').value = registro.fecha_final || '';
  document.getElementById('estudiantes').value = registro.numero_estudiantes || '';
  document.getElementById('servicio').value = registro.servicio || '';
  document.getElementById('tutor').value = registro.tutor_academico || '';
  document.getElementById('disponibilidad-tutor').value = registro.estado || '';
  document.getElementById('observaciones').value = registro.observaciones || '';
  
  const tutorOriginal = registro.tutor_academico;
  const universidadOriginal = registro.institucion_solicitante;
  
  const form = document.getElementById('registroForm');
  const originalSubmit = form.onsubmit;
  
  form.onsubmit = function(e) {
    e.preventDefault();
    
    const nuevoTutor = document.getElementById('tutor').value;
    const nuevaUniversidad = document.getElementById('institucionSolicitante').value;
    
    if ((nuevoTutor !== tutorOriginal || nuevaUniversidad !== universidadOriginal) && 
        tutorYaAsignado(nuevoTutor, nuevaUniversidad, id)) {
      const universidadAsignada = obtenerUniversidadTutor(nuevoTutor);
      alert(`Error: El tutor "${nuevoTutor}" ya está asignado a la universidad "${universidadAsignada}". Por favor, escoja otro tutor.`);
      return;
    }
    
    const registroActualizado = {
      id: id,
      institucion_solicitante: nuevaUniversidad,
      carrera: document.getElementById('carrera').value,
      distrito_asignado: document.getElementById('distritoAsignado').value,
      unidad_salud: document.getElementById('unidadSalud').value,
      horas: parseInt(document.getElementById('horas').value),
      semestre: document.getElementById('semestre').value,
      fecha_inicio: document.getElementById('fechaInicio').value,
      fecha_final: document.getElementById('fechaFin').value,
      numero_estudiantes: parseInt(document.getElementById('estudiantes').value),
      servicio: document.getElementById('servicio').value,
      tutor_academico: nuevoTutor,
      estado: document.getElementById('disponibilidad-tutor').value,
      observaciones: document.getElementById('observaciones').value,
      estudiantes_inscritos: registro.estudiantes_inscritos || 0
    };
    
    todosLosDatos = todosLosDatos.map(item => item.id == id ? registroActualizado : item);
    guardarDatos(todosLosDatos);
    
    alert('✅ Registro actualizado correctamente');
    
    if (carreraSeleccionada === registroActualizado.carrera.toUpperCase()) {
      const elementoCarrera = document.querySelector(`.lista-carreras li[data-carrera="${carreraSeleccionada}"]`);
      filtrarPorCarrera(carreraSeleccionada, elementoCarrera.textContent);
    }
    
    mostrarSeccion('registros');
    form.onsubmit = originalSubmit;
  };
  
  mostrarSeccion('formulario');
  document.getElementById('formulario').scrollIntoView({ behavior: 'smooth' });
}

function eliminarRegistro(id) {
  if (!confirm('¿Está seguro de eliminar este registro?')) return;
  
  todosLosDatos = todosLosDatos.filter(item => item.id != id);
  guardarDatos(todosLosDatos);
  
  alert('Registro eliminado correctamente');
  
  if (carreraSeleccionada) {
    const elementoCarrera = document.querySelector(`.lista-carreras li[data-carrera="${carreraSeleccionada}"]`);
    filtrarPorCarrera(carreraSeleccionada, elementoCarrera.textContent);
  }
}

function exportarExcel() {
  if (!carreraSeleccionada) {
    alert('Seleccione una carrera primero');
    return;
  }
  
  const datosFiltrados = todosLosDatos.filter(item => 
    item.carrera && item.carrera.toUpperCase() === carreraSeleccionada.toUpperCase()
  );
  
  if (datosFiltrados.length === 0) {
    alert('No hay datos para exportar');
    return;
  }
  
  let csvContent = "data:text/csv;charset=utf-8,";
  const headers = [
    "Institución Solicitante",
    "Carrera",
    "Distrito Asignado",
    "Unidad de Salud",
    "N° Horas",
    "Semestre",
    "Fecha Inicio",
    "Fecha Finalización",
    "N° Estudiantes",
    "Servicio",
    "Tutor Académico",
    "Estado",
    "Observaciones"
  ];
  csvContent += headers.join(",") + "\r\n";
  
  datosFiltrados.forEach(item => {
    const row = [
      `"${item.institucion_solicitante || ''}"`,
      `"${formatearCarrera(item.carrera) || ''}"`,
      `"${item.distrito_asignado || ''}"`,
      `"${item.unidad_salud || ''}"`,
      `"${item.horas || ''}"`,
      `"${item.semestre || ''}"`,
      `"${formatearFecha(item.fecha_inicio)}"`,
      `"${formatearFecha(item.fecha_final)}"`,
      `"${item.numero_estudiantes || '0'}"`,
      `"${item.servicio || ''}"`,
      `"${item.tutor_academico || ''}"`,
      `"${formatearEstado(item.estado)}"`,
      `"${item.observaciones || ''}"`
    ];
    csvContent += row.join(",") + "\r\n";
  });
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `pasantias_${carreraSeleccionada}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Funciones para la gestión de recursos
function mostrarRecurso(recurso) {
  // Ocultar todos los contenidos de recursos
  document.querySelectorAll('.resource-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Desactivar todos los botones de pestaña
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Mostrar el contenido seleccionado y activar su botón
  document.getElementById(recurso).classList.add('active');
  document.querySelector(`.tab-btn[onclick="mostrarRecurso('${recurso}')"]`).classList.add('active');
  
  // Cargar los datos correspondientes
  switch(recurso) {
    case 'universidades':
      cargarUniversidades();
      break;
    case 'carreras':
      cargarCarreras();
      break;
    case 'distritos':
      cargarDistritos();
      break;
    case 'unidades-salud':
      cargarUnidadesSaludParaGestion();
      break;
  }
}

// Evento para cargar unidades cuando se selecciona un distrito
document.getElementById('distrito-unidad-salud').addEventListener('change', function() {
  cargarUnidadesDeSalud(this.value);
});

// Eventos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  // Configuración inicial - Crear admin si no existe
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([
      { 
        username: 'admin', 
        email: 'admin@pasantiassistema.com', 
        password: 'admin123', 
        role: 'admin',
        status: 'approved',
        createdAt: new Date().toISOString(),
        approvedBy: 'system'
      }
    ]));
  }

  // Crear elemento para mostrar error de tutor
  const tutorError = document.createElement('div');
  tutorError.id = 'tutorError';
  tutorError.style.color = 'red';
  tutorError.style.display = 'none';
  tutorError.style.marginTop = '5px';
  document.getElementById('tutor').parentNode.appendChild(tutorError);
  
  document.getElementById('buscar-carrera').addEventListener('input', filtrarCarreras);
  
  document.querySelectorAll('.lista-carreras li').forEach(item => {
    item.addEventListener('click', function() {
      seleccionarCarrera(this);
    });
  });
  
  document.getElementById('registroForm').addEventListener('submit', guardarRegistro);
  document.getElementById('searchInput').addEventListener('input', buscarRegistros);
  
  // Validación en tiempo real para tutor
  document.getElementById('tutor').addEventListener('input', function() {
    const tutor = this.value;
    const universidad = document.getElementById('institucionSolicitante').value;
    const tutorError = document.getElementById('tutorError');
    
    if (tutor && universidad && tutorYaAsignado(tutor, universidad)) {
      const universidadAsignada = obtenerUniversidadTutor(tutor);
      tutorError.style.display = 'block';
      tutorError.textContent = `El tutor "${tutor}" ya está asignado a la universidad "${universidadAsignada}". Por favor, escoja otro tutor.`;
    } else {
      tutorError.style.display = 'none';
    }
  });
  
  // Validación cuando cambia la universidad
  document.getElementById('institucionSolicitante').addEventListener('change', function() {
    const tutor = document.getElementById('tutor').value;
    const universidad = this.value;
    const tutorError = document.getElementById('tutorError');
    
    if (tutor && universidad && tutorYaAsignado(tutor, universidad)) {
      const universidadAsignada = obtenerUniversidadTutor(tutor);
      tutorError.style.display = 'block';
      tutorError.textContent = `El tutor "${tutor}" ya está asignado a la universidad "${universidadAsignada}". Por favor, escoja otro tutor.`;
    } else {
      tutorError.style.display = 'none';
    }
  });
  
  // Actualizar badge de usuarios pendientes
  const usuariosPendientes = JSON.parse(localStorage.getItem('usuariosPendientes')) || [];
  document.getElementById('pending-users-badge').textContent = usuariosPendientes.length;
  
  // Inicializar recursos
  cargarUniversidades();
  cargarCarreras();
  cargarDistritos();
  cargarDistritosParaUnidades();

  mostrarSeccion('registros');
});

// Funciones de navegación
function mostrarSeccion(seccion) {
  document.getElementById('formulario').style.display = seccion === 'formulario' ? 'block' : 'none';
  document.getElementById('registros').style.display = seccion === 'registros' ? 'block' : 'none';
  document.getElementById('aprobar-usuarios').style.display = seccion === 'aprobar-usuarios' ? 'block' : 'none';
  document.getElementById('gestion-recursos').style.display = seccion === 'gestion-recursos' ? 'block' : 'none';
  
  if (seccion === 'aprobar-usuarios') {
    mostrarUsuariosPendientes();
  }
  
  if (seccion === 'gestion-recursos') {
    mostrarRecurso('universidades');
  }
}

// Funciones de selección y filtrado
function seleccionarCarrera(elemento) {
  document.querySelectorAll('.lista-carreras li').forEach(li => li.classList.remove('active'));
  elemento.classList.add('active');
  carreraSeleccionada = elemento.getAttribute('data-carrera');
  filtrarPorCarrera(carreraSeleccionada, elemento.textContent);
}

function filtrarPorCarrera(carrera, nombreCarrera) {
  const datosFiltrados = todosLosDatos.filter(item => 
    item.carrera && item.carrera.toUpperCase() === carrera.toUpperCase()
  );
  
  document.getElementById('titulo-carrera').innerHTML = `
    <i class="fas fa-table"></i> ${nombreCarrera}
  `;
  
  document.getElementById('total-registros').textContent = datosFiltrados.length;
  mostrarDatos(datosFiltrados);
}

function mostrarDatos(datos) {
  const contenedor = document.getElementById('contenedor-tabla');
  
  if (datos.length === 0) {
    contenedor.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-database"></i>
        <p>No hay registros para esta carrera</p>
      </div>
    `;
    return;
  }

  let html = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Institución Solicitante</th>
          <th>Carrera</th>
          <th>Distrito Asignado</th>
          <th>Unidad de Salud</th>
          <th>N° Horas</th>
          <th>Semestre</th>
          <th>Fecha Inicio</th>
          <th>Fecha Finalización</th>
          <th>N° Estudiantes</th>
          <th>Servicio</th>
          <th>Tutor Académico</th>
          <th>Estado</th>
          <th>Observaciones</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>`;

  datos.forEach(fila => {
    html += `
      <tr>
        <td>${fila.institucion_solicitante || '-'}</td>
        <td>${formatearCarrera(fila.carrera) || '-'}</td>
        <td>${fila.distrito_asignado || '-'}</td>
        <td>${fila.unidad_salud || '-'}</td>
        <td>${fila.horas || '-'}</td>
        <td>${fila.semestre || '-'}</td>
        <td>${formatearFecha(fila.fecha_inicio)}</td>
        <td>${formatearFecha(fila.fecha_final)}</td>
        <td>${fila.numero_estudiantes || '0'}</td>
        <td>${fila.servicio || '-'}</td>
        <td>${fila.tutor_academico || '-'}</td>
        <td><span class="disponibilidad-badge disponibilidad-${fila.estado || 'desconocido'}">${formatearEstado(fila.estado)}</span></td>
        <td>${fila.observaciones || '-'}</td>
        <td class="action-buttons">
          <button class="edit-btn" onclick="editarRegistro(${fila.id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="delete-btn" onclick="eliminarRegistro(${fila.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>`;
  });

  html += `</tbody></table>`;
  contenedor.innerHTML = html;
}

function filtrarCarreras() {
  const busqueda = document.getElementById('buscar-carrera').value.toLowerCase();
  document.querySelectorAll('.lista-carreras li').forEach(item => {
    const textoCarrera = item.textContent.toLowerCase();
    item.style.display = textoCarrera.includes(busqueda) ? 'block' : 'none';
  });
}

function buscarRegistros() {
  const busqueda = document.getElementById('searchInput').value.toLowerCase();
  const filas = document.querySelectorAll('.data-table tbody tr');
  
  filas.forEach(fila => {
    const textoFila = fila.textContent.toLowerCase();
    fila.style.display = textoFila.includes(busqueda) ? '' : 'none';
  });
}