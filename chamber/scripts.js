// Responsive Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Dynamic Footer Content
const currentYear = new Date().getFullYear();
document.getElementById('current-year').textContent = currentYear;

const lastModified = document.lastModified;
document.getElementById('lastModified').textContent = `Last Modified: ${lastModified}`;

//Directory page

const container = document.getElementById('membersContainer');
const gridButton = document.getElementById('gridView');
const listButton = document.getElementById('listView');

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

gridButton.addEventListener('click', () => {
    container.classList.remove('list');
    container.classList.add('grid');
});

listButton.addEventListener('click', () => {
    container.classList.remove('grid');
    container.classList.add('list');
});

fetchMembers();