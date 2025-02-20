// Handle Admin Registration
let user = localStorage.getItem('admin');

const userRoleElement = document.getElementById('user-role');
user = JSON.parse(user);
if (user?.firstName) {

    userRoleElement.textContent = user?.firstName;
}

userRoleElement.addEventListener('click', function () {
    if (!user) {
        window.location.href = 'sign-in.html';
    }
});

const saveButton = document.getElementById('save-course');
saveButton.textContent = 'Save';
const token = localStorage.getItem('authToken');

if (!token) {
  window.location.href = '/admin/index.html';
}

saveButton.addEventListener('click', async function () {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const instructor = document.getElementById('instructor').value;
    const type = document.getElementById('courseType').value;
    const price = document.getElementById('price').value;
    const studentsCount = document.getElementById('studentsCount').value;
    const duration = document.getElementById('duration').value
    const pdf = document.getElementById('pdf').files[0];
    const image = document.getElementById('image').files[0];
    const sectionsContainer = document.getElementById('sectionsContainer');

    // File type and size validation
    const validPdfTypes = ['application/pdf'];
    const validImageTypes = ['image/jpeg', 'image/png'];
    const maxFileSize = 5 * 1024 * 1024; // 5MB max size for files

    if (title && description && instructor && pdf && image && price && studentsCount && type && duration) {
        if (!validPdfTypes.includes(pdf.type)) {
            alert('Please upload a valid PDF file.');
            return;
        }
        if (!validImageTypes.includes(image.type)) {
            alert('Please upload a valid image file (JPG or PNG).');
            return;
        }
        if (pdf.size > maxFileSize || image.size > maxFileSize) {
            alert('File size exceeds the maximum allowed limit of 5MB.');
            return;
        }
        const sections = Array.from(sectionsContainer.querySelectorAll('.section-item')).map((section) => ({
            sectionTitle: section.querySelector('.section-title').value,
            lessons: Array.from(section.querySelectorAll('.lesson-item')).map((lesson) => ({
                title: lesson.querySelector('.lesson-title').value,
                duration: lesson.querySelector('.lesson-duration').value,
            })),
        }));

        // Disable the save button while the request is in progress
        saveButton.disabled = true;
        saveButton.textContent = 'Saving...';

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('instructor', instructor);
        formData.append('pdf', pdf);
        formData.append('image', image);
        formData.append('price', price);
        formData.append('studentsCount', studentsCount);
        formData.append('type', type);
        formData.append('duration', duration);
        formData.append('sections',  JSON.stringify(sections));

        try {
            const response = await fetch('/api/course/add-course', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                document.getElementById('add-course-form').reset();
                const modal = document.getElementById('addCourseModal');
                const modalInstance = bootstrap.Modal.getInstance(modal);
                modalInstance.hide();
                fetchCourses(); // Fetch and update courses after adding a new one
            } else {
                alert('Error adding course: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to the server.');
        } finally {
            // Re-enable the save button after the request completes
            saveButton.disabled = false;
            saveButton.textContent = 'Save Course';
        }
    } else {
        alert('Please fill out all fields.');
    }
});



// Fetch and display all courses
async function fetchCourses() {
    try {
        const response = await fetch('/api/course/all-courses');
        const courses = await response.json();
        const coursesContainer = document.getElementById('courses-container');
        coursesContainer.innerHTML = '';

        courses.forEach((course) => {

            const courseCard = `
        <div class="col-md-4">
            <div class="card mb-4 shadow-sm">
                <img src="${course.image}" class="card-img-top" alt="${course.title}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${course.title}</h5>
                    <p class="card-text">${course.description}</p>
                    <p class="card-text"><strong>instructor:</strong> ${course.instructor}</p>
                    <a href="${course.pdf}" target="_blank" class="btn btn-primary">Download PDF</a>
                                    <td>
            <button class="btn btn-warning btn-sm" data-course='${JSON.stringify(course)}' onclick="editCourse(this)">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteCourse('${course._id}')">Delete</button>
        </td>
                </div>
            </div>
        </div>`;
            coursesContainer.innerHTML += courseCard;
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        alert('Failed to load courses.');
    }
}

async function deleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course?')) {
        try {
            console.log(courseId);
            const response = await fetch(`/api/course/all-courses/${courseId}`, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                fetchCourses(); // Refresh courses list after deletion
            } else {
                alert('Error deleting course: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to the server.');
        }
    }
}

// // Edit a course
function editCourse(button) {
    const course = JSON.parse(button.getAttribute('data-course'));

    // Populate form fields with course data
    document.getElementById('title').value = course.title;
    document.getElementById('description').value = course.description;
    document.getElementById('instructor').value = course.instructor;
    document.getElementById('courseType').value = course?.type;
    document.getElementById('price').value = course?.price;
    document.getElementById('studentsCount').value = course?.studentsCount;
    document.getElementById('duration').value = course?.duration
    const sectionsContainer = document.getElementById('sectionsContainer');


    sectionsContainer.innerHTML = '';
    course?.sections.forEach((section, sectionIndex) => {
        const sectionTemplate = `
    <div class="section-item mb-3" data-section-index="${sectionIndex}">
      <div class="input-group mb-2">
        <input
          type="text"
          class="form-control section-title"
          value="${section.sectionTitle}"
          placeholder="Section Title"
          required
        />
        <button type="button" class="btn btn-danger remove-section">Remove Section</button>
      </div>
      <div class="lessons-container">
        <label class="form-label">Lessons</label>
        ${section.lessons
                .map(
                    (lesson) => `
          <div class="input-group mb-2 lesson-item">
            <input
              type="text"
              class="form-control lesson-title"
              value="${lesson.title}"
              placeholder="Lesson Title"
              required
            />
            <input
              type="text"
              class="form-control lesson-duration"
              value="${lesson.duration}"
              placeholder="Duration (e.g., 45:00 m)"
              required
            />
            <button type="button" class="btn btn-danger remove-lesson">Remove Lesson</button>
          </div>
        `
                )
                .join('')}
      </div>
      <button type="button" class="btn btn-secondary add-lesson">Add Lesson</button>
    </div>
  `;
        sectionsContainer.insertAdjacentHTML('beforeend', sectionTemplate);
    });

    const updateButton = document.getElementById('update-course');
    updateButton.classList.remove('hidden');
    const saveButton = document.getElementById('save-course');
    saveButton.classList.add('hidden');

    updateButton.textContent = 'Update Course';

    updateButton.onclick = async function () {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const instructor = document.getElementById('instructor').value;
        const pdf = document.getElementById('pdf').files[0];
        const image = document.getElementById('image').files[0];
        const type = document.getElementById('courseType').value;
        const price = document.getElementById('price').value;
        const studentsCount = document.getElementById('studentsCount').value;
        const duration = document.getElementById('duration').value

        const sections = Array.from(
            sectionsContainer.querySelectorAll('.section-item')
        ).map((section) => ({
            sectionTitle: section.querySelector('.section-title').value.trim(),
            lessons: Array.from(section.querySelectorAll('.lesson-item')).map(
                (lesson) => ({
                    title: lesson.querySelector('.lesson-title').value.trim(),
                    duration: lesson.querySelector('.lesson-duration').value.trim(),
                })
            ),
        }));

        // Ensure all fields are filled, but pdf and image are optional
        if (title && description && instructor && price && studentsCount && duration) {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('instructor', instructor);
            formData.append('price', price);
            formData.append('studentsCount', studentsCount);
            formData.append('type', type);
            formData.append('duration', duration);
            formData.append('sections', JSON.stringify(sections));

            // Only append files if they exist
            if (pdf) formData.append('pdf', pdf);
            if (image) formData.append('image', image);

            try {
                const response = await fetch(`/api/course/all-courses/${course._id}`, {
                    method: 'PUT',
                    body: formData,
                });

                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                    // Reset form fields
                    document.getElementById('add-course-form').reset();
                    // Close modal
                    const modal = document.getElementById('addCourseModal');
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    modalInstance.hide();

                    //             // Refresh the course list
                    fetchCourses();
                } else {
                    alert('Error updating course: ' + result.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to connect to the server.');
            }
        } else {
            alert('Please fill out all fields.');
        }
    };

    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('addCourseModal'));
    modal.show();
    document.getElementById('addCourseModal').addEventListener('hidden.bs.modal', function () {
        document.getElementById('add-course-form').reset();
        document.getElementById('pdf').value = '';
        document.getElementById('image').value = '';
        const updateCourse = document.getElementById('update-course');
        updateCourse.classList.add('hidden');
        const saveButton = document.getElementById('save-course');
        saveButton.classList.remove('hidden');
    });
}

async function fetchCourseTypes() {
    try {
        const response = await fetch('/api/course/all-type');
        const data = await response.json();

        if (response.ok) {
            const courseTypeDropdown = document.getElementById('courseType');
            courseTypeDropdown.innerHTML = '';

            data.courseTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type._id;
                option.textContent = type.name;
                courseTypeDropdown.appendChild(option);
            });
        } else {
            console.error('Error fetching course types:', data.message);
        }
    } catch (error) {
        console.error('Error fetching course types:', error);
    }
}
fetchCourseTypes();

// // Fetch courses on page load
document.addEventListener('DOMContentLoaded', fetchCourses);


document.addEventListener('DOMContentLoaded', () => {
    const sectionsContainer = document.getElementById('sectionsContainer');

    // Add Section
    document.querySelector('.add-section').addEventListener('click', () => {
        const sectionIndex = sectionsContainer.children.length;
        const sectionTemplate = `
        <div class="section-item mb-3" data-section-index="${sectionIndex}">
          <div class="input-group mb-2">
            <input
              type="text"
              class="form-control section-title"
              placeholder="Section Title"
              required
            />
            <button type="button" class="btn btn-danger remove-section">Remove Section</button>
          </div>
          <div class="lessons-container">
            <label class="form-label">Lessons</label>
            <div class="input-group mb-2 lesson-item">
              <input
                type="text"
                class="form-control lesson-title"
                placeholder="Lesson Title"
                required
              />
              <input
                type="text"
                class="form-control lesson-duration"
                placeholder="Duration (e.g., 45:00 m)"
                required
              />
              <button type="button" class="btn btn-danger remove-lesson">Remove Lesson</button>
            </div>
          </div>
          <button type="button" class="btn btn-secondary add-lesson">Add Lesson</button>
        </div>
      `;
        sectionsContainer.insertAdjacentHTML('beforeend', sectionTemplate);
    });

    // Remove Section
    sectionsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-section')) {
            event.target.closest('.section-item').remove();
        }
    });

    // Add Lesson
    sectionsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-lesson')) {
            const lessonsContainer = event.target.previousElementSibling;
            const lessonTemplate = `
          <div class="input-group mb-2 lesson-item">
            <input
              type="text"
              class="form-control lesson-title"
              placeholder="Lesson Title"
              required
            />
            <input
              type="text"
              class="form-control lesson-duration"
              placeholder="Duration (e.g., 45:00 m)"
              required
            />
            <button type="button" class="btn btn-danger remove-lesson">Remove Lesson</button>
          </div>
        `;
            lessonsContainer.insertAdjacentHTML('beforeend', lessonTemplate);
        }
    });

    // Remove Lesson
    sectionsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-lesson')) {
            event.target.closest('.lesson-item').remove();
        }
    });
});

document.getElementById('logout-btn').addEventListener('click', function () {
    // Clear token from localStorage/sessionStorage
    localStorage.removeItem('authToken');
  localStorage.removeItem('admin');
    sessionStorage.removeItem('authToken');

    // Redirect to login page
      window.location.href = '/index.html';

  });