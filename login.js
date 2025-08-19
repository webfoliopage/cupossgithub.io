 document.addEventListener('DOMContentLoaded', function() {
  // Función para cambiar entre pestañas
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
    });
    
    if(tabName === 'login') {
      document.getElementById('loginTab').classList.add('active');
    } else {
      document.getElementById('registerTab').classList.add('active');
    }
  }

  // Event listeners para los tabs
  document.getElementById('loginTab').addEventListener('click', function() {
    switchTab('login');
  });

  document.getElementById('registerTab').addEventListener('click', function() {
    switchTab('register');
  });

  // Toggle password visibility
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const passwordInput = document.getElementById(targetId);
      
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        this.classList.remove('fa-eye');
        this.classList.add('fa-eye-slash');
      } else {
        passwordInput.type = 'password';
        this.classList.remove('fa-eye-slash');
        this.classList.add('fa-eye');
      }
    });
  });

  // Asegurar que el admin exista
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

  // Login Form
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const errorElement = document.getElementById('loginError');
    
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

    sessionStorage.setItem('currentUser', JSON.stringify(user));
    errorElement.textContent = '';
    
    setTimeout(() => {
      if (user.role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'usuario.html';
      }
    }, 300);
  });

  // Register Form
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

    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.some(u => u.username === username)) {
      errorElement.textContent = 'El nombre de usuario ya existe';
      return;
    }
    
    if (users.some(u => u.email === email)) {
      errorElement.textContent = 'El correo electrónico ya está registrado';
      return;
    }

    const newUser = {
      username,
      email,
      password,
      role: 'user',
      status: 'pending',
      createdAt: new Date().toISOString(),
      approvedBy: null
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Guardar en pendientes (opcional)
    const pendingUsers = JSON.parse(localStorage.getItem('usuariosPendientes')) || [];
    pendingUsers.push(newUser);
    localStorage.setItem('usuariosPendientes', JSON.stringify(pendingUsers));

    // Mostrar mensaje de éxito
    errorElement.style.color = '#4bb543';
    errorElement.textContent = '¡Registro exitoso! Tu cuenta está pendiente de aprobación.';
    
    // Limpiar formulario y cambiar a login después de 2 segundos
    this.reset();
    setTimeout(() => {
      errorElement.style.color = '';
      switchTab('login');
    }, 2000);
  });
});