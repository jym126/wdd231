document.addEventListener("DOMContentLoaded", function () {
    const gridContainer = document.querySelector(".grid-container");
    
    // Añadir placeholder de carga
    const placeholder = document.createElement('div');
    placeholder.classList.add('grid-placeholder');
    gridContainer.appendChild(placeholder);

    fetch("data/discover_data.json")
        .then(response => response.json())
        .then(data => {
            // Eliminar placeholder antes de añadir contenido
            gridContainer.removeChild(placeholder);

            data.items.forEach(item => {
                const card = document.createElement("article");
                card.classList.add("grid-item");
                
                // Crear elementos DOM directamente en lugar de usar innerHTML
                const h2 = document.createElement('h2');
                h2.textContent = item.name;
                
                const figure = document.createElement('figure');
                const img = document.createElement('img');
                img.src = item.image;
                img.alt = item.name;
                img.width = 300;
                img.height = 200;
                img.decoding = "async";
                img.style.opacity = 0;
                img.addEventListener('load', () => img.style.opacity = 1);
                
                figure.appendChild(img);
                
                const address = document.createElement('address');
                address.textContent = item.address;
                
                const p = document.createElement('p');
                p.textContent = item.description;
                
                const button = document.createElement('button');
                button.setAttribute('aria-label', `Learn more about ${item.name}`);
                const a = document.createElement('a');
                a.href = "https://www.turismoasturias.es/en/";
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                a.textContent = "Places of Asturias";
                button.appendChild(a);
                
                // Añadir todos los elementos al card
                card.append(h2, figure, address, p, button);
                gridContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error loading data:", error);
            gridContainer.removeChild(placeholder);
            
            // Mostrar mensaje de error al usuario
            const errorMsg = document.createElement('p');
            errorMsg.textContent = "Failed to load content. Please try again later.";
            errorMsg.style.color = "red";
            errorMsg.style.textAlign = "center";
            errorMsg.style.padding = "2rem";
            gridContainer.appendChild(errorMsg);
        });

    // Visitor Message Logic (se mantiene igual)
    const visitorMessage = document.getElementById("visitor-message");
    const lastVisit = localStorage.getItem("lastVisit");
    const currentDate = Date.now();

    if (!lastVisit) {
        visitorMessage.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const lastVisitDate = parseInt(lastVisit);
        const daysDifference = Math.floor((currentDate - lastVisitDate) / (1000 * 60 * 60 * 24));

        visitorMessage.textContent = daysDifference < 1 
            ? "Back so soon! Awesome!" 
            : `You last visited ${daysDifference} day${daysDifference > 1 ? 's' : ''} ago.`;
    }
    
    localStorage.setItem("lastVisit", currentDate);
});