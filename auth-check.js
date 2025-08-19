// auth-check.js - Protección de rutas

document.addEventListener('DOMContentLoaded', function() {
  const currentUser = sessionStorage.getItem('currentUser');
  
  if (!currentUser) {
    // Si no hay usuario logueado, redirigir al login
    window.location.href = 'index.html';
    return;
  }
  
  const user = JSON.parse(currentUser);
  
  // Verificar si la página coincide con el rol del usuario
  const isAdminPage = window.location.pathname.includes('admin.html');
  const isUserPage = window.location.pathname.includes('usuario.html');
  
  if ((isAdminPage && user.role !== 'admin') || (isUserPage && user.role !== 'user')) {
    // Redirigir a la página correspondiente según su rol
    window.location.href = user.role === 'admin' ? 'admin.html' : 'usuario.html';
  }
  
  // Mostrar información del usuario en la interfaz
  displayUserInfo(user);
});

function displayUserInfo(user) {
  const userInfoElement = document.getElementById('user-info');
  if (userInfoElement) {
    userInfoElement.innerHTML = `
      <span>${user.username}</span>
      <div class="dropdown">
        <button class="dropdown-btn">
          <i class="fas fa-user-circle"></i>
          <i class="fas fa-chevron-down"></i>
        </button>
        <div class="dropdown-content">
          <a href="#" id="logout-btn">Cerrar sesión</a>
        </div>
      </div>
    `;
    
    document.getElementById('logout-btn').addEventListener('click', logout);
  }
}

function logout() {
  sessionStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}