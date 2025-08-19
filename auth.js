 document.addEventListener('DOMContentLoaded', function() {
  // Inicializar datos si no existen
  initializeData();

  // Configurar eventos de la interfaz
  setupUIEvents();

  // Configurar formularios
  setupForms();
});

function initializeData() {
  // Asegurar que exista el usuario admin
  let users = JSON.parse(localStorage.getItem('users')) || [];
  const adminExists = users.some(u => u.username === 'admin');
  
  if (!adminExists) {
    users.push({
      username: 'admin',
      email: 'admin@pasantiassistema.com',
      password: 'admin123',
      role: 'admin',
      status: 'approved',
      createdAt: new Date().toISOString(),
      approvedBy: 'system'
    });
    localStorage.setItem('users', JSON.stringify(users));
  }

  // Inicializar lista de pendientes si no existe
  if (!localStorage.getItem('usuariosPendientes')) {
    localStorage.setItem('usuariosPendientes', JSON.stringify([]));
  }
}

function setupUIEvents() {
  // Cambiar entre pestañas
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      switchTab(tabName);
    });
  });

  // Toggle para mostrar/ocultar contraseña
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const passwordInput = document.getElementById(targetId);
      const isPassword = passwordInput.type === 'password';
      
      passwordInput.type = isPassword ? 'text' : 'password';
      this.classList.toggle('fa-eye-slash', isPassword);
      this.classList.toggle('fa-eye', !isPassword);
    });
  });
}

function switchTab(tabName) {
  // Ocultar todos los contenidos
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Mostrar el contenido seleccionado
  document.getElementById(tabName).classList.add('active');
  
  // Actualizar botones activos
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === tabName) {
      btn.classList.add('active');
    }
  });

  // Limpiar mensajes de error
  document.getElementById('loginError').textContent = '';
  document.getElementById('registerError').textContent = '';
}

function setupForms() {
  // Formulario de Login
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const errorElement = document.getElementById('loginError');
    
    // Validaciones
    if (!username || !password) {
      errorElement.textContent = 'Por favor complete todos los campos';
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      errorElement.textContent = 'Credenciales incorrectas';
      return;
    }

    if (user.status !== 'approved' && user.role !== 'admin') {
      errorElement.textContent = 'Tu cuenta está pendiente de aprobación';
      return;
    }

    // Guardar usuario en sesión
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    errorElement.textContent = '';
    
    // Redirigir según rol
    setTimeout(() => {
      window.location.href = user.role === 'admin' ? 'admin.html' : 'usuario.html';
    }, 300);
  });

  // Formulario de Registro
  document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const errorElement = document.getElementById('registerError');

    // Validaciones
    if (!username || !email || !password || !confirmPassword) {
      errorElement.textContent = 'Todos los campos son obligatorios';
      return;
    }
    
    if (password !== confirmPassword) {
      errorElement.textContent = 'Las contraseñas no coinciden';
      return;
    }
    
    if (password.length < 8) {
      errorElement.textContent = 'La contraseña debe tener al menos 8 caracteres';
      return;
    }

    // Validar formato de email simple
    if (!email.includes('@') || !email.includes('.')) {
      errorElement.textContent = 'Ingrese un correo electrónico válido';
      return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let usuariosPendientes = JSON.parse(localStorage.getItem('usuariosPendientes')) || [];
    
    // Verificar si usuario o email ya existen
    if (users.some(u => u.username === username)) {
      errorElement.textContent = 'El nombre de usuario ya existe';
      return;
    }
    
    if (users.some(u => u.email === email)) {
      errorElement.textContent = 'El correo electrónico ya está registrado';
      return;
    }

    // Crear nuevo usuario
    const newUser = {
      username,
      email,
      password,
      role: 'user',
      status: 'pending',
      createdAt: new Date().toISOString(),
      approvedBy: null
    };
    
    // Guardar usuario en usuarios principales
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Agregar a pendientes para que el admin lo vea
    usuariosPendientes.push(newUser);
    localStorage.setItem('usuariosPendientes', JSON.stringify(usuariosPendientes));

    // Mostrar mensaje de éxito
    errorElement.style.color = '#4bb543';
    errorElement.textContent = '¡Registro exitoso! Tu cuenta está pendiente de aprobación por el administrador.';
    
    // Limpiar formulario y cambiar a login
    this.reset();
    setTimeout(() => {
      errorElement.style.color = '';
      switchTab('login');
    }, 3000);
  });
}