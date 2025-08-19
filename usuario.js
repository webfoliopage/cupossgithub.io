 // Datos de las pasantías
let pasantiasData = JSON.parse(localStorage.getItem('pasantiasData')) || [];
let estudiantesData = JSON.parse(localStorage.getItem('estudiantesData')) || [];

// Variables globales
let carreraSeleccionada = null;
let pasantiaSeleccionada = null;

// Función para formatear estado
function formatearEstado(estado) {
  const estados = {
    'autorizado': 'Autorizado',
    'finalizado': 'Finalizado',
    'en_proceso': 'En proceso',
    'cancelado': 'Cancelado',
    'disponible': 'Disponible',
    'parcial': 'Parcial',
    'no_disponible': 'No Disponible'
  };
  return estados[estado] || estado || 'Desconocido';
}

// Función para determinar disponibilidad mejorada
function determinarDisponibilidad(fechaInicio, fechaFin, estudiantesInscritos, cuposTotales) {
  const hoy = new Date();
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  
  const cuposDisponibles = cuposTotales - estudiantesInscritos;
  const porcentajeDisponible = (cuposDisponibles / cuposTotales) * 100;
  
  // Determinar estado basado en fechas y cupos
  if (hoy < inicio) {
    return {
      estado: cuposDisponibles <= 0 ? 'PROXIMAMENTE_SIN_CUPOS' : 'PROXIMAMENTE',
      clase: cuposDisponibles <= 0 ? 'proximamente sin-cupos' : 'proximamente',
      texto: cuposDisponibles <= 0 ? 'Próximo (Sin cupos)' : 'Próximo',
      cuposDisponibles,
      puedeRegistrar: cuposDisponibles > 0
    };
  } else if (hoy >= inicio && hoy <= fin) {
    if (cuposDisponibles <= 0) {
      return {
        estado: 'ACTIVO_SIN_CUPOS',
        clase: 'cerrado',
        texto: 'AGOTADO',
        cuposDisponibles: 0,
        puedeRegistrar: false
      };
    } else if (porcentajeDisponible <= 25) {
      return {
        estado: 'ACTIVO_POCOS_CUPOS',
        clase: 'disponible pocos-cupos',
        texto: 'DISPONIBLE',
        cuposDisponibles,
        puedeRegistrar: true
      };
    } else {
      return {
        estado: 'ACTIVO',
        clase: 'disponible',
        texto: 'DISPONIBLE',
        cuposDisponibles,
        puedeRegistrar: true
      };
    }
  } else {
    return {
      estado: 'CERRADO',
      clase: 'cerrado',
      texto: 'CERRADO',
      cuposDisponibles: 0,
      puedeRegistrar: false
    };
  }
}

// Función para formatear fecha
function formatearFecha(fechaStr) {
  if (!fechaStr) return '-';
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString('es-ES');
}

// Función para mostrar los datos en la tabla
function mostrarDatos(datos) {
  const contenedor = document.getElementById('contenedor-tabla');
  
  if (datos.length === 0) {
    contenedor.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-database"></i>
        <p>No hay registros para esta carrera</p>
      </div>
    `;
    
    document.getElementById('total-cupos').textContent = '0';
    document.getElementById('cupos-activos').textContent = '0';
    document.getElementById('cupos-proximos').textContent = '0';
    document.getElementById('total-registrados').textContent = '0';
    
    return;
  }

  let totalCupos = 0;
  let cuposActivos = 0;
  let cuposProximos = 0;
  let totalRegistrados = 0;

  let html = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Institución</th>
          <th>Distrito</th>
          <th>Unidad de Salud</th>
          <th>Fecha Inicio - Fin</th>
          <th>Horas</th>
          <th>Cupos</th>
          <th>Disponibilidad</th>
          <th>Tutor</th>
          <th>Estado</th>
          <th>Registros</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>`;

  datos.forEach(pasantia => {
    const disponibilidad = determinarDisponibilidad(
      pasantia.fecha_inicio,
      pasantia.fecha_final,
      pasantia.estudiantes_inscritos || 0,
      pasantia.numero_estudiantes
    );
    
    const numRegistrados = estudiantesData.filter(e => e.pasantiaId === pasantia.id).length;
    
    totalCupos += pasantia.numero_estudiantes;
    totalRegistrados += numRegistrados;
    
    if (disponibilidad.estado.includes('ACTIVO')) cuposActivos++;
    if (disponibilidad.estado.includes('PROXIMAMENTE')) cuposProximos++;
    
    const porcentajeDisponible = (disponibilidad.cuposDisponibles / pasantia.numero_estudiantes) * 100;
    if (porcentajeDisponible <= 25 && porcentajeDisponible > 0) {
      mostrarNotificacion(`¡Atención! Quedan pocos cupos (${disponibilidad.cuposDisponibles}) para ${pasantia.unidad_salud || pasantia.institucion_solicitante}`);
    }
    
    html += `
      <tr>
        <td>${pasantia.institucion_solicitante || '-'}</td>
        <td>${pasantia.distrito_asignado || pasantia.distrito || '-'}</td>
        <td>${pasantia.unidad_salud || '-'}</td>
        <td class="date-range">
          <span>${formatearFecha(pasantia.fecha_inicio)}</span>
          <i class="fas fa-arrow-right"></i>
          <span>${formatearFecha(pasantia.fecha_final)}</span>
        </td>
        <td>${pasantia.horas || pasantia.numero_horas || '-'}</td>
        <td class="cupos-cell">
          ${disponibilidad.cuposDisponibles} / ${pasantia.numero_estudiantes}
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${(disponibilidad.cuposDisponibles / pasantia.numero_estudiantes) * 100}%"></div>
          </div>
        </td>
        <td>
          <span class="disponibilidad-badge ${disponibilidad.clase}">
            ${disponibilidad.texto}
          </span>
          ${disponibilidad.estado === 'ACTIVO_POCOS_CUPOS' ? 
            '<div class="aviso-cupos">POCOS CUPOS</div>' : ''}
        </td>
        <td>${pasantia.tutor_academico || '-'}</td>
        <td>${formatearEstado(pasantia.estado) || '-'}</td>
        <td>${numRegistrados}</td>
        <td>
          <button class="btn-registro" data-id="${pasantia.id}" ${!disponibilidad.puedeRegistrar ? 'disabled' : ''}>
            <i class="fas fa-user-plus"></i> Registrar
          </button>
        </td>
      </tr>`;
  });

  html += `</tbody></table>`;
  contenedor.innerHTML = html;
  
  document.getElementById('total-cupos').textContent = totalCupos;
  document.getElementById('cupos-activos').textContent = cuposActivos;
  document.getElementById('cupos-proximos').textContent = cuposProximos;
  document.getElementById('total-registrados').textContent = totalRegistrados;
  
  document.querySelectorAll('.btn-registro').forEach(btn => {
    btn.addEventListener('click', function() {
      const pasantiaId = parseInt(this.getAttribute('data-id'));
      abrirModalConfirmacion(pasantiaId);
    });
  });
}

// Función para mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'info') {
  const notificacion = document.createElement('div');
  notificacion.className = `notificacion ${tipo}`;
  notificacion.innerHTML = `
    <i class="fas ${tipo === 'error' ? 'fa-exclamation-circle' : tipo === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
    <span>${mensaje}</span>
  `;
  document.body.appendChild(notificacion);
  
  setTimeout(() => {
    notificacion.classList.add('mostrar');
  }, 100);
  
  setTimeout(() => {
    notificacion.classList.remove('mostrar');
    setTimeout(() => {
      document.body.removeChild(notificacion);
    }, 300);
  }, 5000);
}

// Función para abrir el modal de confirmación
function abrirModalConfirmacion(pasantiaId) {
  pasantiaSeleccionada = pasantiasData.find(p => p.id === pasantiaId);
  const cuposDisponibles = pasantiaSeleccionada.numero_estudiantes - (pasantiaSeleccionada.estudiantes_inscritos || 0);
  
  const modal = document.getElementById('confirmModal');
  const modalMessage = document.getElementById('modal-message');
  
  modalMessage.innerHTML = `
    Estás a punto de registrar un estudiante en:<br><br>
    <strong>${pasantiaSeleccionada.unidad_salud || pasantiaSeleccionada.institucion_solicitante}</strong><br>
    <small>${pasantiaSeleccionada.distrito || 'Distrito no especificado'}</small><br><br>
    <div class="cupos-info">
      <i class="fas fa-users"></i> Cupos disponibles: ${cuposDisponibles}/${pasantiaSeleccionada.numero_estudiantes}
    </div>
  `;
  
  modal.classList.add('show');
  setTimeout(() => {
    modal.style.display = 'block';
  }, 10);
}

// Función para cerrar el modal
function cerrarModal() {
  const modal = document.getElementById('confirmModal');
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);
}

// Función para registrar un estudiante
function registrarEstudiante() {
  if (!pasantiaSeleccionada) return;
  
  const confirmBtn = document.getElementById('confirm-register');
  const originalText = confirmBtn.innerHTML;
  confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
  confirmBtn.disabled = true;
  
  setTimeout(() => {
    const cuposDisponibles = pasantiaSeleccionada.numero_estudiantes - (pasantiaSeleccionada.estudiantes_inscritos || 0);
    if (cuposDisponibles <= 0) {
      mostrarNotificacion('Error: No hay cupos disponibles', 'error');
      cerrarModal();
      return;
    }
    
    const pasantiaIndex = pasantiasData.findIndex(p => p.id === pasantiaSeleccionada.id);
    if (pasantiaIndex !== -1) {
      pasantiasData[pasantiaIndex].estudiantes_inscritos = 
        (pasantiasData[pasantiaIndex].estudiantes_inscritos || 0) + 1;
    }
    
    const nuevoRegistro = {
      id: estudiantesData.length > 0 ? Math.max(...estudiantesData.map(e => e.id)) + 1 : 1,
      pasantiaId: pasantiaSeleccionada.id,
      fechaRegistro: new Date().toISOString(),
      carrera: pasantiaSeleccionada.carrera,
      institucion: pasantiaSeleccionada.institucion_solicitante,
      unidadSalud: pasantiaSeleccionada.unidad_salud,
      estudiante: `Estudiante ${estudiantesData.length + 1}`
    };
    
    estudiantesData.push(nuevoRegistro);
    
    localStorage.setItem('estudiantesData', JSON.stringify(estudiantesData));
    localStorage.setItem('pasantiasData', JSON.stringify(pasantiasData));
    
    confirmBtn.innerHTML = originalText;
    confirmBtn.disabled = false;
    
    const nuevosCuposDisponibles = pasantiaSeleccionada.numero_estudiantes - pasantiasData[pasantiaIndex].estudiantes_inscritos;
    mostrarNotificacion(`Registro exitoso! Cupos restantes: ${nuevosCuposDisponibles}`, 'success');
    
    cerrarModal();
    filtrarPorCarrera(carreraSeleccionada, document.querySelector('.lista-carreras li.active').textContent);
  }, 1500);
}

// Función para filtrar por carrera
function filtrarPorCarrera(carrera, nombreCarrera) {
  const datosFiltrados = pasantiasData.filter(item => 
    item.carrera && item.carrera.toUpperCase() === carrera.toUpperCase()
  );
  
  document.getElementById('titulo-carrera').innerHTML = `
    <i class="fas fa-table"></i> ${nombreCarrera}
  `;
  
  mostrarDatos(datosFiltrados);
}

// Función para seleccionar carrera
function seleccionarCarrera(elemento) {
  document.querySelectorAll('.lista-carreras li').forEach(li => li.classList.remove('active'));
  elemento.classList.add('active');
  carreraSeleccionada = elemento.getAttribute('data-carrera');
  filtrarPorCarrera(carreraSeleccionada, elemento.textContent);
}

// Función para filtrar carreras en el buscador
function filtrarCarreras() {
  const busqueda = document.getElementById('buscar-carrera').value.toLowerCase();
  document.querySelectorAll('.lista-carreras li').forEach(item => {
    const textoCarrera = item.textContent.toLowerCase();
    item.style.display = textoCarrera.includes(busqueda) ? 'flex' : 'none';
  });
}

// Función para verificar cambios en los datos
function verificarCambios() {
  const nuevasPasantias = JSON.parse(localStorage.getItem('pasantiasData')) || [];
  const nuevosEstudiantes = JSON.parse(localStorage.getItem('estudiantesData')) || [];
  
  if (JSON.stringify(pasantiasData) !== JSON.stringify(nuevasPasantias)) {
    pasantiasData = nuevasPasantias;
    mostrarNotificacion('Se han actualizado los datos de pasantías');
    if (carreraSeleccionada) {
      filtrarPorCarrera(carreraSeleccionada, document.querySelector('.lista-carreras li.active').textContent);
    }
  }
  
  if (JSON.stringify(estudiantesData) !== JSON.stringify(nuevosEstudiantes)) {
    estudiantesData = nuevosEstudiantes;
    if (carreraSeleccionada) {
      filtrarPorCarrera(carreraSeleccionada, document.querySelector('.lista-carreras li.active').textContent);
    }
  }
}

// Eventos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  pasantiasData = JSON.parse(localStorage.getItem('pasantiasData')) || [];
  estudiantesData = JSON.parse(localStorage.getItem('estudiantesData')) || [];

  document.getElementById('buscar-carrera').addEventListener('input', filtrarCarreras);
  
  document.querySelectorAll('.lista-carreras li').forEach(item => {
    item.addEventListener('click', function() {
      seleccionarCarrera(this);
    });
  });
  
  document.querySelector('.close-modal').addEventListener('click', cerrarModal);
  document.getElementById('confirm-register').addEventListener('click', registrarEstudiante);
  document.getElementById('cancel-register').addEventListener('click', cerrarModal);
  
  window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('confirmModal')) {
      cerrarModal();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('confirmModal').style.display === 'block') {
      cerrarModal();
    }
  });
  
  window.addEventListener('storage', (e) => {
    if (e.key === 'pasantiasData' || e.key === 'estudiantesData') {
      verificarCambios();
    }
  });
  
  setInterval(verificarCambios, 3000);
  
  if (pasantiasData.length === 0) {
    pasantiasData = [
      {
        id: 1,
        carrera: "PSICOLOGIA",
        institucion_solicitante: "UNIVERSIDAD TÉCNICA DE AMBATO",
        numero_estudiantes: 12,
        unidad_salud: "SAN GUSEL (CS-A)",
        distrito: "08004",
        fecha_inicio: "2025-08-14",
        fecha_final: "2025-08-08",
        numero_horas: 58,
        estudiantes_inscritos: 0,
        estado: "disponible",
        tutor_academico: "Andres Noronjo"
      },
      {
        id: 2,
        carrera: "PSICOLOGIA",
        institucion_solicitante: "UNIVERSIDAD INDOAMERICA",
        numero_estudiantes: 15,
        unidad_salud: "HOSPITAL DE AMBATO",
        distrito: "Distrito 18D02",
        fecha_inicio: "2023-09-01",
        fecha_final: "2023-12-15",
        numero_horas: 240,
        estudiantes_inscritos: 10,
        estado: "disponible"
      },
      {
        id: 3,
        carrera: "MEDICINA",
        institucion_solicitante: "UNIVERSIDAD TÉCNICA DE AMBATO",
        numero_estudiantes: 20,
        unidad_salud: "CENTRO DE SALUD 1 (18D02)",
        distrito: "Distrito 18D02",
        fecha_inicio: "2023-08-15",
        fecha_final: "2024-01-20",
        numero_horas: 320,
        estudiantes_inscritos: 15,
        estado: "disponible"
      }
    ];
    localStorage.setItem('pasantiasData', JSON.stringify(pasantiasData));
  }
  
  if (estudiantesData.length === 0) {
    estudiantesData = [];
    localStorage.setItem('estudiantesData', JSON.stringify(estudiantesData));
  }
  
  const primeraCarrera = document.querySelector('.lista-carreras li');
  if (primeraCarrera) {
    primeraCarrera.click();
  }
});