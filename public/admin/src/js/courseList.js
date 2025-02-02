import { getCourses } from './db/models/course.js';
import { createRating } from './rating.js';

export function initCourseList() {
    const coursesGrid = document.getElementById('courses-grid');
    loadCourses();

    async function loadCourses() {
        try {
            const courses = await getCourses();

            coursesGrid.innerHTML = '';
            courses.forEach(course => {
                coursesGrid.appendChild(createCourseCard(course));
            });
        } catch (error) {
            console.error('Error loading courses:', error);
            coursesGrid.innerHTML = '<p>Error loading courses. Please try again later.</p>';
        }
    }
}

function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card';

    const content = `
        ${course.image_url ? `<img src="${course.image_url}" alt="${course.name}" class="course-image">` : ''}
        <div class="course-content">
            <h3 class="course-title">${course.name}</h3>
            <div class="rating"></div>
            <p class="course-description">${course.description}</p>
            ${course.pdf_url ? `
                <a href="${course.pdf_url}" target="_blank" rel="noopener noreferrer" class="course-pdf">
                    View Course Material
                </a>
            ` : ''}
        </div>
    `;

    card.innerHTML = content;
    createRating(card.querySelector('.rating'), { readonly: true, value: course.rating });

    return card;
}