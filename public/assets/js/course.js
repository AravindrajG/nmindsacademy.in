// Fetch and display all courses
async function fetchCourses() {
    try {
        const response = await fetch('/api/course/all-courses');
        const courses = await response.json();
        const coursesContainer = document.getElementById('course-container');
        coursesContainer.innerHTML = '';

        courses.forEach((course) => {
            // Get the rating from the course data
            const rating = course.rating.average; // Assuming 'rating' is a number (1 to 5)

            // Generate the stars dynamically based on the rating
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= rating) {
                    starsHtml += '<i class="fas fa-star"></i>'; // Filled star
                } else {
                    starsHtml += '<i class="far fa-star"></i>'; // Empty star
                }
            }

            const courseCard = `
                <div class="col-xl-4 col-lg-6 col-md-6">
                    <div class="courses-card-main-items">
                        <div class="courses-card-items style-2">
                            <div class="courses-image">
                                <img src="uploads/${course.image}" alt="${course.title}">
                                <h3 class="courses-title">${course.title}</h3>
                                <h4 class="topic-title"></h4>
                            </div>
                            <div class="courses-content">
                                <ul class="post-cat">
                                    <li>
                                        <a href="courses-grid.html">${course?.type?.name
                                            ?.toLowerCase()
                                            ?.split(' ')
                                            ?.map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                            ?.join(' ') || ''}</a>
                                    </li>
                                    <li>
                                        ${starsHtml}
                                    </li>
                                </ul>
                                <h3>
                                    <a href="courses-details.html?id=${course._id}">
                                        ${course.title}
                                    </a>
                                </h3>
                                <div class="client-items">
                                    <div class="client-img bg-cover" style="background-image: url('assets/img/courses/client-1.png');"></div>
                                    <p>${course?.instructor}</p>
                                </div>
                                <ul class="post-class">
                                    <li>
                                        <i class="far fa-books"></i>
                                        Lessons
                                    </li>
                                    <li>
                                        <i class="far fa-user"></i>
                                        ${course?.studentsCount}
                                    </li>
                                    <li>
                                        <a href="courses-details.html?id=${course?._id}" class="theme-btn">Enroll Now</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>`;

            // Append the course card to the container
            coursesContainer.innerHTML += courseCard;
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        alert('Failed to load courses.');
    }
}

// Fetch courses on page load
document.addEventListener('DOMContentLoaded', fetchCourses);
