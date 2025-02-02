const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get("id");
fetchCourseDetails(eventId);
let courseId = null;

async function fetchCourseDetails(eventId) {
    try {
        const url = eventId
            ? `/api/course/get/${eventId}`
            : `/api/course/random`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch event details.");
        }

        const event = await response.json();
        populateEventDetails(event);
    } catch (error) {
        console.error("Error fetching event details:", error);
        alert("Unable to load event details. Please try again later.");
    }
}

function populateEventDetails(course) {
    courseId = course._id;
    document.getElementById('courseTitle').innerText = course.title || '';
    document.getElementById('instructorName').innerText = course.instructor || '';
    document.getElementById('categoryName').innerText = course.type.name || '';
    document.getElementById('coursePrice').innerText = course?.price && '₹ ' + course?.price || "Free";
    document.getElementById('description-content').innerHTML = course.description || ''

    const coursesItem = document.getElementById('courses-items');

    coursesItem.innerHTML = `
                                <div class="courses-items">
                                    <div class="courses-image">
                                        <img src="uploads/${course.image}" alt="img">
                                        <h3 class="courses-title">${course.title}</h3>
                                        <div class="arrow-items">
                                            <div class="GlidingArrow">
                                                <img src="assets/img/courses/a1.png" alt="img">
                                            </div>
                                            <div class="GlidingArrow delay1">
                                                <img src="assets/img/courses/a2.png" alt="img">
                                            </div>
                                            <div class="GlidingArrow delay2">
                                                <img src="assets/img/courses/a3.png" alt="img">
                                            </div>
                                            <div class="GlidingArrow delay3">
                                                <img src="assets/img/courses/a4.png" alt="img">
                                            </div>
                                            <div class="GlidingArrow delay4">
                                                <img src="assets/img/courses/a5.png" alt="img">
                                            </div>
                                            <div class="GlidingArrow delay5">
                                                <img src="assets/img/courses/a6.png" alt="img">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="courses-content">
                                        <h3>₹ ${course.price}</h3>
                                        <p>
                                            ${course.type.description || 'UX (User Experience) Design the involves understanding needs, behaviors'}.
                                        </p>
                                    </div>
                                </div>`
    const starContainer = document.getElementById('courseReviews');
    const fullStars = course.rating.average;
    for (let i = 0; i < 5; i++) {
        let starHTML = '';

        if (i < Math.floor(fullStars)) {
            // Full star
            starHTML = `<i class="fas fa-star"></i>`;
        } else if (i < fullStars) {
            // Half star
            starHTML = `<i class="fas fa-star-half-alt"></i>`;
        } else {
            // Empty star
            starHTML = `<i class="far fa-star"></i>`;
        }

        // Append the star HTML
        starContainer.innerHTML += starHTML;
    }


    document.getElementById('reviewCount').innerText = `(${course.rating.totalRatedPersons})`;

    const courseReviews = document.getElementById('courses-reviews-box');

    courseReviews.innerHTML = '';

    const generateStars = (fullStars) => {
        // console.log();

        let starsHTML = '';
            for (let i = 0; i < 5; i++) {
                if (i < Math.floor(fullStars)) {
                    // Full star
                    starsHTML += `<i class="fas fa-star"></i>`;
                } else if (i < fullStars) {
                    // Half star
                    starsHTML += `<i class="fas fa-star-half-alt"></i>`;
                } else {
                    // Empty star
                    starsHTML += `<i class="far fa-star"></i>`;
                }
            }
        return starsHTML;
    };

    courseReviews.innerHTML = `
                                                     <div class="courses-reviews-box">
                                                        <div class="reviews-box">
                                                            <h2><span class="count">${course.rating.average || 0}</span></h2>
                                                            <div class="star">
                                                                 ${generateStars(course.rating.average)}
                                                            </div>
                                                            <p>${course.rating.totalRatedPersons || 0}+ Reviews</p>
                                                        </div>
                                                        <div class="reviews-ratting-right">
                                                            <div class="reviews-ratting-item">
                                                                <div class="star" id="star">
                                                                   <div class="star">
                                                                    <i class="fas fa-star"></i>
                                                                    <i class="fas fa-star"></i>
                                                                    <i class="fas fa-star"></i>
                                                                    <i class="fas fa-star"></i>
                                                                    <i class="fas fa-star"></i>
                                                                </div>
                                                                </div>
                                                                <div class="progress">
                                                                    <div class="progress-value style-two"></div>
                                                                </div>
                                                                <span>(${course.rating.ratingCount['5'] || 0})</span>
                                                            </div>
                                                            <div class="reviews-ratting-item">
                                                                <div class="star">
                                                                    <i class="fas fa-star"></i>
                                                                    <i class="fas fa-star"></i>
                                                                    <i class="fas fa-star"></i>
                                                                    <i class="fas fa-star"></i>
                                                                    <i class="fas fa-star color-2"></i>
                                                                </div>
                                                                <div class="progress">
                                                                    <div class="progress-value style-three"></div>
                                                                </div>
                                                                <span>(${course.rating.ratingCount['4'] || 0})</span>
                                                            </div>
                                                            <div class="reviews-ratting-item">
                                                                <div class="star">
                                                                    <i class="fas fa-star"></i>
                                                                    <i class="fas fa-star"></i>
                                                                    <i class="fas fa-star"></i>
                                                                    <i class="fas fa-star color-2"></i>
                                                                    <i class="fas fa-star color-2"></i>
                                                                </div>
                                                                <div class="progress">
                                                                    <div class="progress-value style-three"></div>
                                                                </div>
                                                                <span>(${course.rating.ratingCount['3'] || 0})</span>
                                                            </div>
                                                            <div class="reviews-ratting-item">
                                                                <div class="star">
                                                                    <i class="fas fa-star"></i>
                                                                    <i class="fas fa-star"></i>
                                                                    <i class="fas fa-star color-2"></i>
                                                                    <i class="fas fa-star color-2"></i>
                                                                    <i class="fas fa-star color-2"></i>
                                                                </div>
                                                                <div class="progress">
                                                                    <div class="progress-value style-four"></div>
                                                                </div>
                                                                <span>(${course.rating.ratingCount['2'] || 0})</span>
                                                            </div>
                                                            <div class="reviews-ratting-item">
                                                                <div class="star">
                                                                    <i class="fas fa-star"></i>
                                                                    <i class="fas fa-star color-2"></i>
                                                                    <i class="fas fa-star color-2"></i>
                                                                    <i class="fas fa-star color-2"></i>
                                                                    <i class="fas fa-star color-2"></i>
                                                                </div>
                                                                <div class="progress">
                                                                    <div class="progress-value style-five"></div>
                                                                </div>
                                                                <span>(${course.rating.ratingCount['1'] || 0})</span>
                                                            </div>
                                                        </div>
                                                    </div>`

    populateAccordion(course?.sections);
}

function populateAccordion(sections) {
    const accordionContainer = document.getElementById('accordionExample');

    accordionContainer.innerHTML = '';


    sections.forEach((section, index) => {
        const sectionId = `collapse${index}`;
        const headingId = `heading${index}`;
        const isExpanded = index === 0 ? 'true' : 'false';
        const collapseClass = index === 0 ? 'show' : '';
        const lessonsHtml = section.lessons
            .map(
                (lesson, lessonIndex) => `
                <li>
                    <span>
                        <i class="fas fa-file-alt"></i> Lesson ${lessonIndex + 1} : ${lesson.title}
                    </span>
                    <span>
                        <i class="far fa-lock"></i> (${lesson.duration})
                    </span>
                </li>
            `
            )
            .join('');

        // Build accordion item
        const accordionItem = `
            <div class="accordion-item">
                <h2 class="accordion-header" id="${headingId}">
                    <button class="accordion-button ${index !== 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse"
                        data-bs-target="#${sectionId}" aria-expanded="${isExpanded}" aria-controls="${sectionId}">
                        ${section.sectionTitle}
                    </button>
                </h2>
                <div id="${sectionId}" class="accordion-collapse collapse ${collapseClass}"
                    aria-labelledby="${headingId}" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <ul>
                            ${lessonsHtml}
                        </ul>
                    </div>
                </div>
            </div>
        `;

        accordionContainer.insertAdjacentHTML('beforeend', accordionItem);
    });
}


const rateText = document.getElementById('rateText');
const starsContainer = document.getElementById('stars');
const ratingMessage = document.getElementById('ratingMessage');

rateText.addEventListener('click', () => {
    rateText.style.display = 'none';
    starsContainer.style.display = 'inline-block';
});

starsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('star')) {
        const selectedRating = event.target.getAttribute('data-value');

        document.querySelectorAll('#stars .star').forEach((star, index) => {
            if (index < selectedRating) {
                star.classList.add('selected');
            } else {
                star.classList.remove('selected');
            }
        });

        ratingMessage.textContent = `You rated this ${selectedRating} stars!`;

        sendRatingToServer(selectedRating);
    }
});

async function sendRatingToServer(rating) {
    try {
        const token = localStorage.getItem('authToken');

if (!token) {
  window.location.href = '/sign-in.html';
} else {
  const response = await fetch('/api/course/rate/' + courseId, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ rating: rating }),
  });

  const result = await response.json();

  if (response.status === 401 || response.status === 403) {
    if (result.redirect) {
      window.location.href = '/sign-in.html';
    } else {
      alert(result.message);
    }
  }
}
    } catch (error) {
        console.error('Error:', error);
    }
}

