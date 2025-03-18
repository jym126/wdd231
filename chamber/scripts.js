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

    // Ensure gridButton and listButton exist
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

    // Fetch Members function remains the same
    async function fetchMembers() {
        try {
            const response = await fetch('data/members.json');
            const members = await response.json();
            displayMembers(members);
        } catch (error) {
            console.error('Error fetching member data:', error);
        }
    }

    function displayMembers(members) {
        container.innerHTML = '';
        members.forEach(member => {
            const memberCard = document.createElement('div');
            memberCard.className = 'member-card';
            memberCard.innerHTML = `
                <img src="images/${member.image}" alt="${member.name}">
                <h3>${member.name}</h3>
                <p>${member.address}</p>
                <p>${member.phone}</p>
                <a href="${member.website}" target="_blank">Visit Website</a>
                <p>${member.description}</p>
                <p>Membership Level: ${member.membershipLevel}</p>
            `;
            container.appendChild(memberCard);
        });
    }

    fetchMembers();

    // Weather API
    const apiKey = 'bb9cf104e9f44affcb2307eb90bada12'; // Replace with your OpenWeatherMap API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=Asturias,ES&units=metric&appid=${apiKey}`;

    // Fetch the current weather data
    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            const weatherDescription = data.weather[0].description;
            const temperature = data.main.temp;
            const humidity = data.main.humidity;

            // Display current weather in the page
            document.querySelector('.community-info .current-weather').innerHTML = `
                <h2>Current Weather</h2>
                <p>Temperature: ${temperature}°C</p>
                <p>Humidity: ${humidity}%</p>
                <p>Condition: ${weatherDescription}</p>
            `;
        })
        .catch(error => console.error('Error fetching weather data:', error));

    // Fetch the forecast weather data (next 5 days)
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=Asturias,ES&appid=${apiKey}`;
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            const forecastContainer = document.querySelector('.community-info .weather-forecast');
            forecastContainer.innerHTML = '<h2>Weather Forecast</h2>';

            // Loop through the forecast data and display it (every 8th entry represents the next day)
            for (let i = 0; i < data.list.length; i += 8) {
                const forecast = data.list[i];
                const date = new Date(forecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
                const temp = forecast.main.temp;
                const description = forecast.weather[0].description;

                forecastContainer.innerHTML += `
                    <div>
                        <h3>${date}: ${temp}°F</h3>
                    </div>
                `;
            }
        })
        .catch(error => console.error('Error fetching forecast data:', error));
});
