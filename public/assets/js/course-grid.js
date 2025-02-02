const apiUrl = '/api/course/all-courses';

async function fetchCourses() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            const courses = data;
            const coursesContainer = document.getElementById('courses-container');
            coursesContainer.innerHTML = '';
            card(courses, coursesContainer);
            } else {
            alert('Error fetching courses: ' + data.message);
        }
    } catch (error) {
        console.error('Error fetching courses:', error);
        alert('Error fetching courses');
    }
}

// Call the function to fetch and display courses
fetchCourses();

  document.addEventListener('DOMContentLoaded', async () => {
    const courseTypesContainer = document.querySelector('.courses-list');

    try {
      const response = await fetch('/api/course/all-type'); // Adjust the URL as needed
      if (!response.ok) throw new Error('Failed to fetch course types');

      const courseTypes = await response.json();

      // Clear existing content
      courseTypesContainer.innerHTML = '';

      // Generate course type checkboxes dynamically
      courseTypes?.courseTypes?.forEach(courseType => {
        const checkboxHtml = `
          <label class="checkbox-single">
            <span class="d-flex gap-xl-3 gap-2 align-items-center">
              <span class="checkbox-area d-center">
                <input type="checkbox" value="${courseType._id}">
                <span class="checkmark d-center"></span>
              </span>
              <span class="text-color">
                ${courseType.name}
              </span>
            </span>
          </label>
        `;
        courseTypesContainer.innerHTML += checkboxHtml;
      });
    } catch (error) {
      console.error('Error loading course types:', error);
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    const courseTypesContainer = document.querySelector('.courses-list');
    const coursesContainer = document.getElementById('courses-container');

    // Function to fetch filtered courses
    async function fetchFilteredCourses(selectedTypeIds) {
      try {
        const response = await fetch('/api/course/filter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ typeIds: selectedTypeIds })
        });

        if (!response.ok) throw new Error('Failed to fetch courses');

        const courses = await response.json();
        // Clear existing courses
        coursesContainer.innerHTML = '';
        card(courses, coursesContainer);
        // Render filtered courses

      } catch (error) {
        console.error('Error fetching filtered courses:', error);
      }
    }

    // Event listener for checkboxes
    courseTypesContainer.addEventListener('change', () => {
      const selectedCheckboxes = document.querySelectorAll('.courses-list input[type="checkbox"]:checked');
      const selectedTypeIds = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);

      // Fetch and display filtered courses
      fetchFilteredCourses(selectedTypeIds);
    });
  });


  function card(courses, coursesContainer) {

    return courses.forEach(course => {
        const courseHtml = `
                  <div class="col-xl-4 col-lg-6 col-md-6">
                      <div class="courses-card-main-items mb-4">
                          <div class="courses-card-items">
                              <div class="courses-image">
                                  <img src="/uploads/${course.image}" alt="Course Image" style="height: 250px !important;">
                                  <div class="arrow-items">
                                      <div class="GlidingArrow">
                                          <img src="assets/img/courses/a1.png" alt="arrow">
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
                                  <ul class="post-cat">
                                      <li><a href="courses-grid.html">${course?.type?.name
                                          ?.toLowerCase()
                                          ?.split(' ')
                                          ?.map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                          ?.join(' ') || ''}</a></li>
                                      <li>
                                          <i class="fas fa-star"></i>
                                          <i class="fas fa-star"></i>
                                          <i class="fas fa-star"></i>
                                          <i class="fas fa-star"></i>
                                          <i class="fas fa-star"></i>
                                      </li>
                                  </ul>
                                  <h5><a href="courses-details.html">${course.title}</a></h5>
                                  <div class="client-items">
                                      <div class="client-img bg-cover" style="background-image: url('assets/img/courses/client-1.png');"></div>
                                      <p>${course.instructor}</p>
                                  </div>
                                  <ul class="post-class">
                                      <li><i class="far fa-books"></i> Lessons</li>
                                      <li><i class="far fa-user"></i> ${course.studentsCount}</li>
                                  </ul>
                              </div>
                          </div>
                          <div class="courses-card-items-hover">
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
                                                  <i class="fas fa-star"></i>
                                                  <i class="fas fa-star"></i>
                                                  <i class="fas fa-star"></i>
                                                  <i class="fas fa-star"></i>
                                                  <i class="fas fa-star"></i>
                                              </li>
                                          </ul>
                                          <h5>
                                              <a href="courses-details.html">
                                                  ${course.title} Course
                                              </a>
                                          </h5>
                                          <h4>&#8377 ${course.price}</h4>
                                          <span>
                                              Education is only empowers
                                              people to pursue career
                                          </span>
                                          <div class="client-items">
                                              <div class="client-img bg-cover" style="background-image: url('assets/img/courses/client-1.png');"></div>
                                              <p>${course.instructor}</p>
                                          </div>
                                          <ul class="post-class">
                                              <li>
                                                  <i class="far fa-clock"></i>
                                                 ${course.duration}
                                              </li>
                                              <li>
                                                  <i class="far fa-user"></i>
                                                  ${course.studentsCount}
                                              </li>
                                          </ul>
                                          <a href="courses-details.html?id=${course._id}" class="theme-btn yellow-btn mt-3">Enroll Now</a>
                                      </div>
                                  </div>
                      </div>
                  </div>
        `;
        coursesContainer.innerHTML += courseHtml;
      });
  }

