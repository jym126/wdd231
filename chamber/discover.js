document.addEventListener("DOMContentLoaded", function () {
    const gridContainer = document.querySelector(".grid-container");
    
    // Limpiar el contenedor completamente al inicio
    while (gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.firstChild);
    }
    
    // Añadir placeholder de carga
    const placeholder = document.createElement('div');
    placeholder.classList.add('grid-placeholder');
    placeholder.textContent = 'Loading content...';
    gridContainer.appendChild(placeholder);

    fetch("data/discover_data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Eliminar placeholder
            gridContainer.innerHTML = '';
            
            // Verificar que data.items existe y es un array
            if (!Array.isArray(data.items)) {
                throw new Error('Invalid data format: expected items array');
            }

            // Fragmento de documento para mejor performance
            const fragment = document.createDocumentFragment();
            
            data.items.forEach(item => {
                // Validar datos básicos del item
                if (!item.name || !item.image) {
                    console.warn('Invalid item data:', item);
                    return; // Saltar este item
                }

                const card = document.createElement("article");
                card.classList.add("grid-item");
                
                // Cabecera
                const h2 = document.createElement('h2');
                h2.textContent = item.name || 'Unnamed location';
                
                // Imagen
                const figure = document.createElement('figure');
                const img = document.createElement('img');
                img.src = item.image;
                img.alt = item.name || 'Location image';
                img.width = 300;
                img.height = 200;
                img.decoding = "async";
                img.loading = "lazy";
                img.style.opacity = 0;
                img.addEventListener('load', () => {
                    img.style.opacity = 1;
                    img.style.transition = 'opacity 0.5s ease';
                });
                figure.appendChild(img);
                
                // Dirección
                const address = document.createElement('address');
                address.textContent = item.address || 'Address not available';
                
                // Descripción
                const p = document.createElement('p');
                p.textContent = item.description || 'No description provided';
                
                // Botón
                const button = document.createElement('button');
                button.setAttribute('aria-label', `Learn more about ${item.name}`);
                const a = document.createElement('a');
                a.href = item.link || "https://www.turismoasturias.es/en/";
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                a.textContent = "Places of Asturias";
                button.appendChild(a);
                
                // Ensamblar tarjeta
                card.append(h2, figure, address, p, button);
                fragment.appendChild(card);
            });
            
            gridContainer.appendChild(fragment);
        })
        .catch(error => {
            console.error("Error loading data:", error);
            gridContainer.innerHTML = '';
            
            const errorMsg = document.createElement('div');
            errorMsg.classList.add('error-message');
            errorMsg.innerHTML = `
                <p>Failed to load content. Please try again later.</p>
                <button onclick="window.location.reload()">Retry</button>
            `;
            gridContainer.appendChild(errorMsg);
        });

    // Visitor Message Logic (mejorado)
    const visitorMessage = document.getElementById("visitor-message");
    if (visitorMessage) {  // Verificar que el elemento existe
        const lastVisit = localStorage.getItem("lastVisit");
        const currentDate = Date.now();
        const oneDay = 24 * 60 * 60 * 1000; // milisegundos en un día

        if (!lastVisit) {
            visitorMessage.textContent = "Welcome! Let us know if you have any questions.";
        } else {
            const daysDifference = Math.round((currentDate - parseInt(lastVisit)) / oneDay);
            
            if (daysDifference === 0) {
                visitorMessage.textContent = "Back so soon! Awesome!";
            } else if (daysDifference === 1) {
                visitorMessage.textContent = "You last visited yesterday.";
            } else {
                visitorMessage.textContent = `You last visited ${daysDifference} days ago.`;
            }
        }
        
        localStorage.setItem("lastVisit", currentDate.toString());
    }
});