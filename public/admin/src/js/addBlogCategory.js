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
// Handle Admin Registration
const token = localStorage.getItem('authToken');

if (!token) {
  window.location.href = '/admin/index.html';
}
document.getElementById('registerAdminButton').addEventListener('click', async function (e) {
  e.preventDefault();
  const courseName = document.getElementById('courseName').value;
  const description = document.getElementById('description').value;


  // Validation
  if (!courseName) {
    alert('Please fill out all fields');
    return;
  }
  try {
    const response = await fetch('/api/blogs/category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },

      body: JSON.stringify({
        name: courseName,
        description
      }),
    });

    const result = await response.json();
    if (response.ok) {
      alert('Course Added successfully');
      document.getElementById('coursetype-register-form').reset();
      const modalElement = document.getElementById('addBlogCategory');
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();
      fetchCourseType();
    } else {
      alert('Error registering admin: ' + result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to register admin');
  }
});

async function fetchCourseType() {
  try {
    const response = await fetch('/api/blogs/category', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const courseTypes = await response.json();

    if (response.ok) {
      const adminList = document.getElementById('admin-list');
      adminList.innerHTML = '';

      courseTypes?.courseTypes?.forEach((admin, index) => {

        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${admin?.name}</td>
                    <td>${admin?.description}</td>
                    <td>${new Date(admin?.createdAt).toLocaleDateString('in')}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" data-course='${JSON.stringify(admin)}' onclick="editCourse(this)">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteAdmin('${admin?._id}')">Delete</button>
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

async function editCourse(button) {
  try {
    const modal = new bootstrap.Modal(document.getElementById('addBlogCategory'));
    modal.show();

    const course = JSON.parse(button.getAttribute('data-course'));

    // Populate form fields with course data
    document.getElementById('courseName').value = course.name;
    document.getElementById('description').value = course.description;

    const updateButton = document.getElementById('editButton');
    updateButton.classList.remove('hidden');
    const saveButton = document.getElementById('registerAdminButton');
    saveButton.classList.add('hidden');

    updateButton.textContent = 'Update';

    // Define the token for authentication
    const token = localStorage.getItem('authToken');

    // Set up click handler for update button
    updateButton.onclick = async function (e) {
      // Get updated values
      e.preventDefault();
      const courseName = document.getElementById('courseName').value;
      const description = document.getElementById('description').value;

      try {
        const response = await fetch(`/api/blogs/update/${course._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: courseName,
            description: description,
          }), // Pass JSON directly
        });


        if (response.ok) {
          const data = await response.json();
          console.log('Update successful:', data);
          fetchCourseType();
          modal.hide();
        } else {
          const error = await response.json();
          console.error('Update failed:', error);
          alert(`Error: ${error.message}`);
        }
      } catch (fetchError) {
        console.error('Error sending data to server:', fetchError);
        alert('An error occurred while updating the course.');
      }
    };
  } catch (error) {
    console.error('Error preparing course edit modal:', error);
    alert('Failed to prepare course editing.');
  }
}

async function deleteAdmin(adminId) {
  if(confirm('Are you want to delete?')) {
  try {
      const response = await fetch(`/api/blogs/delete/${adminId}`, {
          method: 'DELETE',
          headers:{
            'Authorization': `Bearer ${token}`,
          }
      });

      const result = await response.json();
      if (response.ok) {
          fetchCourseType();
      } else {
          alert('Error deleting admin: ' + result.message);
      }
  } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete admin');
  }
  }
}

document.getElementById('logout-btn').addEventListener('click', function () {
  // Clear token from localStorage/sessionStorage
  localStorage.removeItem('authToken');
  localStorage.removeItem('admin');
  sessionStorage.removeItem('authToken');

  // Redirect to login page
    window.location.href = '/index.html';

});

document.addEventListener('DOMContentLoaded', fetchCourseType);
