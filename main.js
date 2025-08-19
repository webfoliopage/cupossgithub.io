 document.addEventListener('DOMContentLoaded', function() {
  // Datos de usuarios "simulados" (solo en memoria)
  let users = [
    { username: 'admin', email: 'admin@pasantiassistema.com', password: 'admin123', role: 'admin' },
    { username: 'usuario', email: 'usuario@pasantiassistema.com', password: 'usuario123', role: 'user' }
  ];

  // Elementos del DOM
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  
  // Cambiar entre pestañas
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      tabBtns.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      tabContents.forEach(content => content.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // Mostrar/ocultar contraseña
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const input = document.getElementById(targetId);
      
      if (input.type === 'password') {
        input.type = 'text';
        this.classList.replace('fa-eye', 'fa-eye-slash');
      } else {
        input.type = 'password';
        this.classList.replace('fa-eye-slash', 'fa-eye');
      }
    });
  });
  
  // Validar fuerza de contraseña (visual)
  if (document.getElementById('regPassword')) {
    document.getElementById('regPassword').addEventListener('input', function() {
      const strengthBars = document.querySelectorAll('.strength-bar');
      const strengthText = document.querySelector('.strength-text');
      const password = this.value;
      let strength = 0;
      
      // Reset
      strengthBars.forEach(bar => bar.style.backgroundColor = '#e9ecef');
      
      // Reglas de validación
      if (password.length > 0) strength = 1;
      if (password.length >= 8) strength = 2;
      if (/[A-Z]/.test(password)) strength = 3;
      if (/[0-9!@#$%^&*]/.test(password)) strength = 4;
      
      // Colores según fuerza
      const colors = ['#f72585', '#f8961e', '#f8961e', '#4bb543'];
      const texts = ['débil', 'media', 'fuerte', 'muy fuerte'];
      
      for (let i = 0; i < strength; i++) {
        strengthBars[i].style.backgroundColor = colors[strength-1];
      }
      
      strengthText.textContent = `Seguridad: ${texts[strength-1] || ''}`;
      strengthText.style.color = colors[strength-1] || '#6c757d';
    });
  }
  
  // Procesar Login (simulado)
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value.trim();
      const errorElement = document.getElementById('loginError');
      
      // Buscar usuario
      const user = users.find(u => u.username === username && u.password === password);
      
      if (user) {
        errorElement.textContent = '';
        errorElement.style.color = 'green';
        errorElement.innerHTML = `<i class="fas fa-check-circle"></i> ¡Bienvenido ${user.username}! (Redirección simulada)`;
        
        // Simular redirección después de 1.5 segundos
        setTimeout(() => {
          if (user.role === 'admin') {
            alert('Redirigiendo a panel de administrador (simulado)');
          } else {
            alert('Redirigiendo a dashboard de usuario (simulado)');
          }
        }, 1500);
      } else {
        errorElement.style.color = '#f72585';
        errorElement.textContent = 'Usuario o contraseña incorrectos';
      }
    });
  }
  
  // Procesar Registro (simulado)
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('regUsername').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value.trim();
      const confirmPassword = document.getElementById('regConfirmPassword').value.trim();
      const role = document.getElementById('regRole').value;
      const errorElement = document.getElementById('registerError');
      
      // Validaciones
      if (!username || !email || !password || !confirmPassword || !role) {
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
      
      if (users.some(u => u.username === username)) {
        errorElement.textContent = 'El nombre de usuario ya existe';
        return;
      }
      
      if (users.some(u => u.email === email)) {
        errorElement.textContent = 'El correo electrónico ya está registrado';
        return;
      }
      
      // "Registrar" al usuario (solo en memoria)
      users.push({ username, email, password, role });
      
      // Feedback visual
      errorElement.style.color = '#4bb543';
      errorElement.innerHTML = `<i class="fas fa-check-circle"></i> ¡Registro exitoso! Ahora puedes iniciar sesión`;
      
      // Limpiar formulario
      registerForm.reset();
      document.querySelectorAll('.strength-bar').forEach(bar => {
        bar.style.backgroundColor = '#e9ecef';
      });
      
      // Cambiar a pestaña de login después de 2 segundos
      setTimeout(() => {
        document.querySelector('.tab-btn[data-tab="login"]').click();
        document.getElementById('loginUsername').value = username;
        document.getElementById('loginPassword').value = password;
      }, 2000);
    });
  }
});