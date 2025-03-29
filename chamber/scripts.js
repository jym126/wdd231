document.addEventListener('DOMContentLoaded', () => {
    // Responsive Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    } else {
        console.error('Elements not found: menuToggle or navMenu');
    }

    // Dynamic Footer Content
    const currentYear = new Date().getFullYear();
    document.getElementById('current-year').textContent = currentYear;

    const lastModified = document.lastModified;
    document.getElementById('lastModified').textContent = `Last Modified: ${lastModified}`;

    // Directory page
    const container = document.getElementById('membersContainer');
    const gridButton = document.getElementById('gridView');
    const listButton = document.getElementById('listView');

    if (gridButton && listButton && container) {
        gridButton.addEventListener('click', () => {
            container.classList.remove('list');
            container.classList.add('grid');
        });

        listButton.addEventListener('click', () => {
            container.classList.remove('grid');
            container.classList.add('list');
        });
    } else {
        console.error('Elements not found: gridButton, listButton or container');
    }

    // Fetch Members function
    async function fetchMembers() {
        try {
            const response = await fetch('data/members.json');
            const members = await response.json();

            // Verificar si el contenedor de miembros existe antes de llamar a displayMembers
            const container = document.getElementById('membersContainer');
            if (container) {
                displayMembers(members);
            }

            // Verificar si el contenedor de spotlight existe antes de llamar a displaySpotlightMembers
            const spotlightContainer = document.getElementById('spotlight-container');
            if (spotlightContainer) {
                displaySpotlightMembers(members);
            }
        } catch (error) {
            console.error('Error fetching member data:', error);
        }
    }

    // Function to filter Gold (membershipLevel 3) and Silver (membershipLevel 2) members
    function getSpotlightMembers(members) {
        const spotlightMembers = members.filter(member => member.membershipLevel === 3 || member.membershipLevel === 2);

        // Randomly shuffle the array
        for (let i = spotlightMembers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [spotlightMembers[i], spotlightMembers[j]] = [spotlightMembers[j], spotlightMembers[i]];
        }

        return spotlightMembers.slice(0, Math.floor(Math.random() * 2) + 2);
    }

    // Function to display spotlight members
    function displaySpotlightMembers(members) {
        const spotlightContainer = document.getElementById('spotlight-container');
        const spotlightMembers = getSpotlightMembers(members);

        if (spotlightContainer) {
            spotlightContainer.innerHTML = ''; // Clear any previous content
        } else {
            console.error('Spotlight container not found');
        }

        spotlightMembers.forEach(member => {
            const memberCard = document.createElement('div');
            memberCard.className = 'member-card';

            memberCard.innerHTML = `
                <img src="images/${member.image}" alt="${member.name} Logo" class="member-logo" width="100">
                <h3>${member.name}</h3>
                <p><strong>Phone:</strong> ${member.phone}</p>
                <p><strong>Address:</strong> ${member.address}</p>
                <p><strong>Website:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
                <p><strong>Membership Level:</strong> ${member.membershipLevel === 3 ? 'Gold' : 'Silver'}</p>
            `;

            spotlightContainer.appendChild(memberCard);
        });
    }

    // Function to display all members in the directory
    function displayMembers(members) {
        const container = document.getElementById('membersContainer');

        if (container) {
            container.innerHTML = ''; // Clear previous members if any

            members.forEach(member => {
                const memberCard = document.createElement('div');
                memberCard.className = 'member-card';

                memberCard.innerHTML = `
                    <img src="images/${member.image}" alt="${member.name} Logo" class="member-logo" width="100">
                    <h3>${member.name}</h3>
                    <p><strong>Phone:</strong> ${member.phone}</p>
                    <p><strong>Address:</strong> ${member.address}</p>
                    <p><strong>Website:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
                    <p><strong>Membership Level:</strong> ${member.membershipLevel === 3 ? 'Gold' : member.membershipLevel === 2 ? 'Silver' : 'Other'}</p>
                `;

                container.appendChild(memberCard);
            });
        }
    }

    // Call the fetchMembers function to load members
    fetchMembers();

    // Weather API
    const apiKey = 'bb9cf104e9f44affcb2307eb90bada12'; // Replace with your OpenWeatherMap API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=Asturias,ES&appid=${apiKey}`;

    // Fetch the current weather data
    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            const weatherDescription = data.weather[0].description;
            const temperature = parseInt(data.main.temp);
            const humidity = data.main.humidity;

            // Display current weather in the page
            document.querySelector('.community-info .current-weather').innerHTML = `
                <h2>Current Weather</h2>
                <p>Temperature: ${temperature}°F</p>
                <p>Humidity: ${humidity}%</p>
                <p>Condition: ${weatherDescription}</p>
            `;
        })
        .catch(error => console.error('Error fetching weather data:', error));

    // Fetch the forecast weather data (next 3 days)
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=Asturias,ES&appid=${apiKey}`;
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            const forecastContainer = document.querySelector('.community-info .weather-forecast');
            forecastContainer.innerHTML = '<h2>Weather Forecast</h2>';

            // Limit to 3 days, every 8th entry represents the next day (since API gives forecast every 3 hours)
            for (let i = 0; i < 24; i += 8) {  // We only need the first 3 days
                if (i >= 24) break; // Exit after 3 days

                const forecast = data.list[i];
                const date = new Date(forecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
                const temp = parseInt(forecast.main.temp);
                const description = forecast.weather[0].description;

                forecastContainer.innerHTML += `
                    <div>
                        <h3>${date}: ${temp}°F</h3>
                        <p>Condition: ${description}</p>
                    </div>
                `;
            }
        })
        .catch(error => console.error('Error fetching forecast data:', error));

    // Modal functionality for Membership cards
    const modalLinks = document.querySelectorAll('.select-membership');
    const modals = document.querySelectorAll('.modal');
    const closeBtns = document.querySelectorAll('.close');

    modalLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const targetModal = document.getElementById(link.getAttribute('data-target'));
            targetModal.style.display = 'block';
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Automatically complete membership level in form when card is clicked
    const membershipCards = document.querySelectorAll('.membership-card');
    const membershipLevelSelect = document.getElementById('membership-level');

    membershipCards.forEach(card => {
        card.addEventListener('click', function() {
            const level = card.getAttribute('data-level');
            membershipLevelSelect.value = level; // Set the value of the membership level dropdown
        });
    });

    // Set current timestamp in hidden field
    document.getElementById('timestamp').value = new Date().toISOString();
});
