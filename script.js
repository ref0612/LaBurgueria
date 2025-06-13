document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const menuButton = document.getElementById('mobile-menu-button');
    const menuNav = document.getElementById('menu-nav');
    const overlay = document.getElementById('overlay');
    const navButtons = document.querySelectorAll('.nav-button');
    const menuCategories = document.querySelectorAll('.menu-category');
    const closeModal = document.querySelector('.close');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalIngredients = document.getElementById('modal-ingredients');
    const modalPrice = document.getElementById('modal-price');
    // Función para alternar el menú móvil
    function toggleMenu() {
        const isOpening = !menuNav.classList.contains('active');
        
        if (isOpening) {
            // Abrir menú
            menuButton.classList.add('active');
            menuNav.classList.add('active');
            overlay.style.display = 'block';
            setTimeout(() => {
                overlay.classList.add('active');
                document.body.classList.add('menu-open');
                document.body.style.overflow = 'hidden';
            }, 10);
        } else {
            // Cerrar menú
            menuButton.classList.remove('active');
            menuNav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
            
            setTimeout(() => {
                if (!menuNav.classList.contains('active')) {
                    overlay.style.display = 'none';
                }
            }, 300);
        }
    }
    // Eventos del menú móvil
    if (menuButton) {
        menuButton.addEventListener('click', toggleMenu);
    }
    if (overlay) {
        overlay.addEventListener('click', toggleMenu);
    }
    // Navegación por categorías
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            
            // Añadir efecto de clic en móvil
            if (window.innerWidth <= 768) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
            
            // Actualizar botones activos con animación suave
            navButtons.forEach(btn => {
                btn.classList.remove('active');
                if (window.innerWidth <= 768) {
                    btn.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                }
            });
            
            this.classList.add('active');
            
            // Mostrar solo la categoría seleccionada con mejor transición
            let foundActive = false;
            menuCategories.forEach(cat => {
                if (cat.id === category) {
                    // Ocultar otras categorías primero
                    const otherCategories = Array.from(menuCategories).filter(c => c !== cat);
                    otherCategories.forEach(otherCat => {
                        otherCat.style.opacity = '0';
                        otherCat.style.transform = 'translateY(-20px)';
                        setTimeout(() => {
                            otherCat.classList.remove('active');
                            otherCat.style.display = 'none';
                            otherCat.style.opacity = '';
                            otherCat.style.transform = '';
                        }, 200);
                    });
                    
                    // Mostrar la categoría seleccionada con delay
                    setTimeout(() => {
                        cat.style.display = 'block';
                        cat.classList.add('active');
                        
                        // Scroll suave solo en móvil y después de cerrar el menú
                        if (window.innerWidth <= 768) {
                            setTimeout(() => {
                                cat.scrollIntoView({ 
                                    behavior: 'smooth', 
                                    block: 'start',
                                    inline: 'nearest'
                                });
                            }, 100);
                        } else {
                            setTimeout(() => {
                                cat.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 50);
                        }
                    }, window.innerWidth <= 768 ? 250 : 100);
                    
                    foundActive = true;
                } else {
                    // No hacer nada aquí, ya se maneja arriba
                }
            });
            
            // Si no se encontró la categoría, mostrar la primera
            if (!foundActive && menuCategories.length > 0) {
                setTimeout(() => {
                    menuCategories[0].style.display = 'block';
                    menuCategories[0].classList.add('active');
                    navButtons[0].classList.add('active');
                }, 200);
            }
            
            // Cerrar menú móvil si está abierto con delay para mejor UX
            if (menuNav.classList.contains('active')) {
                setTimeout(() => {
                    toggleMenu();
                }, window.innerWidth <= 768 ? 300 : 0);
            }
        });
    });
    
    // Función para mostrar una categoría específica
    function showCategory(categoryId) {
        menuCategories.forEach(cat => {
            if (cat.id === categoryId) {
                cat.style.display = 'block';
                cat.classList.add('active');
                // Desplazarse suavemente a la categoría
                setTimeout(() => {
                    cat.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
            } else {
                cat.style.display = 'none';
                cat.classList.remove('active');
            }
        });
    }
    // Ocultar todas las categorías al inicio
    menuCategories.forEach(cat => {
        cat.style.display = 'none';
        cat.classList.remove('active');
    });
    
    // Mostrar solo la categoría de hamburguesas al inicio
    const defaultCategory = 'hamburguesas';
    const defaultCategoryElement = document.getElementById(defaultCategory);
    
    if (defaultCategoryElement) {
        showCategory(defaultCategory);
        
        // Marcar el botón de la categoría activa
        const activeButton = document.querySelector(`.nav-button[data-category="${defaultCategory}"]`);
        if (activeButton) {
            navButtons.forEach(btn => btn.classList.remove('active'));
            activeButton.classList.add('active');
        }
    }
    // Mostrar/ocultar categorías al hacer scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeCategory = entry.target.id;
                navButtons.forEach(button => {
                    if (button.getAttribute('data-category') === activeCategory) {
                        button.classList.add('active');
                    } else {
                        button.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);
    menuCategories.forEach(category => {
        observer.observe(category);
    });
    // Funcionalidad del modal de imágenes - Temporalmente deshabilitada
    /*
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            // Evitar que el clic se propague si se hace en un enlace o botón
            if (e.target.tagName === 'A' || e.target.closest('a') || e.target.tagName === 'BUTTON') {
                return;
            }
            
            const imgSrc = this.getAttribute('data-image-src');
            
            if (imgSrc) {
                // Mostrar el modal con animación
                modalImg.src = imgSrc;
                modalImg.alt = this.querySelector('h3')?.textContent || 'Imagen del producto';
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    */
    // Cerrar modal
    function closeImageModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    // Cerrar al hacer clic en la X
    if (closeModal) {
        closeModal.addEventListener('click', closeImageModal);
    }
    // Cerrar al presionar ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeImageModal();
        }
    });
    // Cerrar al hacer clic fuera de la imagen
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });
    // Inicializar la primera categoría como activa
    if (menuCategories.length > 0) {
        menuCategories[0].classList.add('active');
    }
});