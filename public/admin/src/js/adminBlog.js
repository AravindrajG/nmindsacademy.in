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

const token = localStorage.getItem('authToken');

if (!token) {
  window.location.href = '/admin/index.html';
}
document.getElementById('saveBlog').addEventListener('click', async (e) => {
    e.preventDefault();

    const form = document.getElementById('addBlogForm'); // Select the actual form

    const formData = new FormData();

    // Append form inputs
    formData.append('title', form.title.value);
    formData.append('author', form.author.value);
    formData.append('date', form.date.value);
    formData.append('mainContent', form.mainContent.value);
    formData.append('subheading', form.subheading.value);
    formData.append('quote', form.quote.value);
    formData.append('bullets', form.bullets.value);
    formData.append('subheadingH4', form.subheadingH4.value);
    formData.append('additionalContent', form.additionalContent.value);
    formData.append('blogCategory', form.BlogType.value);

    // Append files
    if (form.mainImage.files[0]) {
        formData.append('mainImage', form.mainImage.files[0]);
    }
    if (form.secondImage.files[0]) {
        formData.append('secondImage', form.secondImage.files[0]);
    }

    try {
        const response = await fetch('/api/blogs/submit', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            alert('Blog post saved successfully!');
            form.reset();
            const modal = document.getElementById('createBlogModal');
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (err) {
        console.error('Error submitting the blog form:', err);
        alert('An error occurred while submitting the blog post.');
    }
});


async function fetchCourseType() {
    try {
        const response = await fetch('/api/blogs/getBlogs', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const admins = await response.json();

        if (response.ok) {
            const adminList = document.getElementById('admin-list');
            adminList.innerHTML = '';

            admins.forEach((blog, index) => {

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index+1}</td>
                    <td>${blog.title}</td>
                    <td>${new Date(blog?.date).toLocaleDateString('in')}</td>
                    <td>${blog?.author}</td>
                    <td>
                    <button 
                        class="btn btn-warning btn-sm" 
                        onclick='editEvent(${JSON.stringify(blog).replace(/'/g, "&apos;").replace(/"/g, "&quot;")})'>
                        Edit
                    </button>                    
                    <button class="btn btn-danger btn-sm" onclick="deleteEvent('${blog?._id}')">Delete</button>
                    </td>
                `;
                adminList.appendChild(row);
            });
        } else {
            alert('Error fetching admins');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch admin data');
    }
}

fetchCourseType();


const editEvent =  (courseData) => {

    const updateButton = document.getElementById('updateBlog');
    updateButton.classList.remove('hidden');
    const saveButton = document.getElementById('saveBlog');
    saveButton.classList.add('hidden');
    document.getElementById('createBlogModalLabel').textContent = "Update Blog Post";

    console.log(courseData, courseData?.blogCategory?.name);

    // Pre-fill form fields with course data
    document.getElementById('title').value = courseData.title || '';
    document.getElementById('author').value = courseData.author || '';
    document.getElementById('date').value = new Date(courseData.date).toISOString().split('T')[0] || '';
    document.getElementById('subheading').value = courseData.subheading || '';
    document.getElementById('quote').value = courseData.quote || '';
    document.getElementById('bullets').value = courseData.bullets || '';
    document.getElementById('subheadingH4').value = courseData.subheadingH4 || '';
    document.getElementById('additionalContent').value = courseData.additionalContent || '';
    document.getElementById('mainContent').value = courseData.mainContent || '';
    // document.getElementById('BlogType').value = courseData?.blogCategory?.name;
    fetchCourseTypes(courseData)

    const blogId = courseData._id;

    // Show the modal
    const myModal = new bootstrap.Modal(document.getElementById('createBlogModal'));
    myModal.show();

    updateButton.onclick = async (e) => {
        e.preventDefault();
        const form = document.getElementById('addBlogForm');
        const formData = new FormData();

        // Append text fields
        formData.append('title', form.title.value);
        formData.append('author', form.author.value);
        formData.append('date', form.date.value);
        formData.append('subheading', form.subheading.value);
        formData.append('quote', form.quote.value);
        formData.append('bullets', form.bullets.value);
        formData.append('subheadingH4', form.subheadingH4.value);
        formData.append('additionalContent', form.additionalContent.value);
        formData.append('mainContent', form.mainContent.value);
        formData.append('blogCategory', form.BlogType.value);


        // Append files if provided
        if (form.mainImage.files[0]) {
            formData.append('mainImage', form.mainImage.files[0]);
        }
        if (form.secondImage.files[0]) {
            formData.append('secondImage', form.secondImage.files[0]);
        }

        const token = localStorage.getItem('authToken'); // Retrieve the auth token

        try {
            const response = await fetch(`/api/blogs/blog/${blogId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            // Handle response and parse JSON only if the request was successful
            if (response.ok) {
                const res = await response.json();
                alert('Blog updated successfully!');
                const modal = document.getElementById('createBlogModal');
                const modalInstance = bootstrap.Modal.getInstance(modal);
                modalInstance.hide();
                fetchCourseType()
            } else {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error updating blog:', error);
            alert('An error occurred while updating the blog.');
        }
    };


    document.getElementById('createBlogModal').addEventListener('hidden.bs.modal', function () {
        document.getElementById('addBlogForm').reset();
        document.getElementById('createBlogModalLabel').textContent = "Create New Blog Post";
        updateButton.classList.add('hidden');
        saveButton.classList.remove('hidden');
    });
};

const deleteEvent = async (id) => {

        if (confirm('Are you sure you want to delete this course?')) {
            try {
                const response = await fetch(`/api/blogs/blog/${id}`, {
                    method: 'DELETE',
                });
                const result = await response.json();

                if (response.ok) {
                    alert(result.message);
                    fetchCourseType(); // Refresh courses list after deletion
                } else {
                    alert('Error deleting course: ' + result.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to connect to the server.');
            }
        }
    }


    async function fetchCourseTypes(courseData) {
        try {
            const response = await fetch('/api/blogs/category', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                const courseTypeDropdown = document.getElementById('BlogType');
                courseTypeDropdown.innerHTML = '';  // Clear existing options

                data.courseTypes.forEach(type => {
                    const option = document.createElement('option');
                    option.value = type._id;  // Set the value to the _id
                    option.textContent = type.name;  // Set the display name

                    // If the category matches, set this option as selected
                    if (type.name === courseData?.blogCategory?.name) {
                        option.selected = true;
                    }

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

    document.getElementById('logout-btn').addEventListener('click', function () {
        // Clear token from localStorage/sessionStorage
        localStorage.removeItem('authToken');
  localStorage.removeItem('admin');
        sessionStorage.removeItem('authToken');

        // Redirect to login page
          window.location.href = '/index.html';

      });