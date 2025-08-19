 document.addEventListener('DOMContentLoaded', function() {
    // Configuración del carrusel
    const slides = document.querySelectorAll(".slide");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    const indicatorsContainer = document.querySelector(".indicators");
    let currentIndex = 0;
    let interval;
    const slideInterval = 6000; // 6 segundos

    // Crear indicadores
    slides.forEach((_, index) => {
        const indicator = document.createElement("div");
        indicator.classList.add("indicator");
        if (index === 0) indicator.classList.add("active");
        indicator.addEventListener("click", () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });

    const indicators = document.querySelectorAll(".indicator");

    // Mostrar slide
    function showSlide(index) {
        // Ocultar todos los slides
        slides.forEach(slide => {
            slide.classList.remove("active");
            slide.style.opacity = 0;
        });
        
        // Ocultar todos los indicadores
        indicators.forEach(ind => ind.classList.remove("active"));
        
        // Mostrar slide actual
        slides[index].classList.add("active");
        setTimeout(() => {
            slides[index].style.opacity = 1;
        }, 10);
        
        // Activar indicador actual
        indicators[index].classList.add("active");
        
        // Actualizar índice actual
        currentIndex = index;
    }

    // Siguiente slide
    function nextSlide() {
        const newIndex = (currentIndex + 1) % slides.length;
        showSlide(newIndex);
    }

    // Slide anterior
    function prevSlide() {
        const newIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(newIndex);
    }

    // Ir a slide específico
    function goToSlide(index) {
        showSlide(index);
        resetInterval();
    }

    // Iniciar intervalo automático
    function startInterval() {
        interval = setInterval(nextSlide, slideInterval);
    }

    // Reiniciar intervalo
    function resetInterval() {
        clearInterval(interval);
        startInterval();
    }

    // Event listeners
    prevBtn.addEventListener("click", () => {
        prevSlide();
        resetInterval();
    });

    nextBtn.addEventListener("click", () => {
        nextSlide();
        resetInterval();
    });

    // Pausar al interactuar
    const carousel = document.querySelector(".carousel");
    carousel.addEventListener("mouseenter", () => clearInterval(interval));
    carousel.addEventListener("mouseleave", startInterval);

    // Soporte para teclado
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            prevSlide();
            resetInterval();
        } else if (e.key === "ArrowRight") {
            nextSlide();
            resetInterval();
        }
    });

    // Iniciar
    showSlide(currentIndex);
    startInterval();

    // Efecto de animación al hacer scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.card, .info-section, .features');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = 1;
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Configurar elementos para animación
    window.addEventListener('load', function() {
        const elements = document.querySelectorAll('.card, .info-section, .features');
        
        elements.forEach(element => {
            element.style.opacity = 0;
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        
        animateOnScroll();
    });

    window.addEventListener('scroll', animateOnScroll);
});