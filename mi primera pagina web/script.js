// Referencias generales
const buscador = document.getElementById('buscador');
const tarjetas = document.querySelectorAll('.tarjeta');
const mensajeSinResultados = document.getElementById('sin-resultados');
const btnJardin = document.getElementById('btn-jardin');

// 1. Buscador en tiempo real
if (buscador) {
    buscador.addEventListener('input', () => {
        const textoBusqueda = buscador.value.toLowerCase().trim();
        let encontrados = 0;

        tarjetas.forEach(tarjeta => {
            const nombre = tarjeta.dataset.nombre ? tarjeta.dataset.nombre.toLowerCase() : '';
            if (nombre.includes(textoBusqueda)) {
                tarjeta.style.display = '';
                encontrados++;
            } else {
                tarjeta.style.display = 'none';
            }
        });

        if (mensajeSinResultados) {
            mensajeSinResultados.style.display = (encontrados === 0) ? 'block' : 'none';
        }
    });
}

// 2. Lógica del Jardín (Favoritos)
let favoritos = JSON.parse(localStorage.getItem('jardinFavoritos')) || [];

function actualizarFavoritosUI() {
    tarjetas.forEach(tarjeta => {
        const nombre = tarjeta.dataset.nombre;
        const btnFav = tarjeta.querySelector('.btn-fav');
        if (btnFav) {
            if (favoritos.includes(nombre)) {
                btnFav.classList.add('activo');
                btnFav.textContent = '❤️ En el Jardín';
            } else {
                btnFav.classList.remove('activo');
                btnFav.textContent = '🤍 Añadir';
            }
        }
    });

    if (btnJardin) {
        btnJardin.textContent = `Mi Jardín (${favoritos.length})`;
    }
}

tarjetas.forEach(tarjeta => {
    const btnFav = tarjeta.querySelector('.btn-fav');
    const nombre = tarjeta.dataset.nombre;

    if (btnFav) {
        btnFav.addEventListener('click', () => {
            if (favoritos.includes(nombre)) {
                favoritos = favoritos.filter(f => f !== nombre);
            } else {
                favoritos.push(nombre);
            }
            localStorage.setItem('jardinFavoritos', JSON.stringify(favoritos));
            actualizarFavoritosUI();
        });
    }
});

let mostrandoSoloJardin = false;
if (btnJardin) {
    btnJardin.addEventListener('click', () => {
        mostrandoSoloJardin = !mostrandoSoloJardin;
        
        tarjetas.forEach(tarjeta => {
            const nombre = tarjeta.dataset.nombre;
            if (mostrandoSoloJardin) {
                tarjeta.style.display = favoritos.includes(nombre) ? '' : 'none';
            } else {
                tarjeta.style.display = '';
            }
        });

        btnJardin.style.backgroundColor = mostrandoSoloJardin ? '#e11d48' : '';
        btnJardin.style.color = mostrandoSoloJardin ? '#ffffff' : '';
    });
}

// 3. Lógica del Modal para Regalar por WhatsApp
const modal = document.getElementById('modal-regalo');
const cerrarModal = document.getElementById('cerrar-modal');
const nombreFlorModal = document.getElementById('nombre-flor-modal');
const formRegalo = document.getElementById('form-regalo');
let florSeleccionada = '';

tarjetas.forEach(tarjeta => {
    const btnRegalar = tarjeta.querySelector('.btn-regalar');
    const nombre = tarjeta.dataset.nombre;

    if (btnRegalar) {
        btnRegalar.addEventListener('click', () => {
            florSeleccionada = nombre;
            if (nombreFlorModal) nombreFlorModal.textContent = nombre;
            if (modal) modal.style.display = 'flex';
        });
    }
});

if (cerrarModal) {
    cerrarModal.addEventListener('click', () => {
        if (modal) modal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

if (formRegalo) {
    formRegalo.addEventListener('submit', (e) => {
        e.preventDefault();
        const destinatario = document.getElementById('nombre-destinatario').value;
        const mensaje = document.getElementById('mensaje-dedicatoria').value;

        const textoWhatsApp = `¡Hola ${destinatario}! 🌸 Te he regalado una *${florSeleccionada}* desde "El Jardín de las Almas".\n\n"${mensaje}"`;
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(textoWhatsApp)}`;

        window.open(url, '_blank');
        if (modal) modal.style.display = 'none';
        formRegalo.reset();
    });
}

// Inicializar
actualizarFavoritosUI();
