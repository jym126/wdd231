document.addEventListener("DOMContentLoaded", function () {
    const gridContainer = document.querySelector(".grid-container");

    fetch("data/discover_data.json")
        .then(response => response.json())
        .then(data => {
            data.items.forEach(item => {
                const card = document.createElement("div");
                card.classList.add("grid-item");

                card.innerHTML = `
                    <h2>${item.name}</h2>
                    <figure>
                        <img src="${item.image}" alt="${item.name}" width="300" height="200">
                    </figure>
                    <address>${item.address}</address>
                    <p>${item.description}</p>
                    <button><a href="https://www.turismoasturias.es/en/" target="_blank">Learn More</button>
                `;
                gridContainer.appendChild(card);
            });
        })
        .catch(error => console.error("Error loading data:", error));

    // Visitor Message Logic
    const visitorMessage = document.getElementById("visitor-message");
    const lastVisit = localStorage.getItem("lastVisit");
    const currentDate = Date.now();

    if (!lastVisit) {
        visitorMessage.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const lastVisitDate = parseInt(lastVisit);
        const daysDifference = Math.floor((currentDate - lastVisitDate) / (1000 * 60 * 60 * 24));

        if (daysDifference < 1) {
            visitorMessage.textContent = "Back so soon! Awesome!";
        } else {
            visitorMessage.textContent = `You last visited ${daysDifference} day${daysDifference > 1 ? 's' : ''} ago.`;
        }
    }
    
    localStorage.setItem("lastVisit", currentDate);
});
