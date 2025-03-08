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

// Course List Array
const courses = [
    { code: "WDD 131", name: "Dynamic Web Fundamentals", credits: 3, completed: true },
    { code: "WDD 230", name: "Web Frontend Development I", credits: 3, completed: true },
    { code: "WDD 231", name: "Web Frontend Development II", credits: 3, completed: false },
    { code: "CSE 111", name: "Programming with Functions", credits: 3, completed: false },
    { code: "CSE 121", name: "Programming with Structures", credits: 3, completed: true },
    { code: "CSE 210", name: "Programming with Classes", credits: 3, completed: false },
];

// Function to display courses
function displayCourses(filter = "all") {
    const container = document.getElementById('courses-container');
    container.innerHTML = ""; // Clear existing content

    let filteredCourses = courses;
    if (filter === "wdd") {
        filteredCourses = courses.filter(course => course.code.startsWith("WDD"));
    } else if (filter === "cse") {
        filteredCourses = courses.filter(course => course.code.startsWith("CSE"));
    }

    filteredCourses.forEach(course => {
        const card = document.createElement('div');
        card.classList.add('course-card');
        if (course.completed) {
            card.classList.add('completed');
        }
        card.innerHTML = `
            <h3>${course.code}</h3>
            <p>${course.name}</p>
            <p>Credits: ${course.credits}</p>
        `;
        container.appendChild(card);
    });

    // Calculate total credits
    const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
    document.getElementById('total-credits').textContent = totalCredits;
}

// Event listeners for filter buttons
document.getElementById('filter-all').addEventListener('click', () => displayCourses('all'));
document.getElementById('filter-wdd').addEventListener('click', () => displayCourses('wdd'));
document.getElementById('filter-cse').addEventListener('click', () => displayCourses('cse'));

// Initial display of courses
displayCourses();