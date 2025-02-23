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
document.getElementById('registerAdminButton').addEventListener('click', async function () {
    const courseName = document.getElementById('courseName').value;
    const description = document.getElementById('description').value;


    // Validation
    if (!courseName) {
      alert('Please fill out all fields');
      return;
    }
    try {
      const button = document.getElementById('registerAdminButton')
      button.disabled = true;
      const response = await fetch('/api/course/all-type', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            name:courseName,
            description
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Course Added successfully');
        document.getElementById('coursetype-register-form').reset();
        const modalElement = document.getElementById('addCourseType');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
        // fetchAdmins();
      } else {
        alert('Error registering admin: ' + result.message);
      }
      button.disabled = false;
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to register admin');
      button.disabled = false;
    }
  });

  async function fetchCourseType() {
    try {
        const response = await fetch('/api/course/all-type');
        const courseTypes = await response.json();

        if (response.ok) {
            const adminList = document.getElementById('admin-list');
            adminList.innerHTML = '';

            courseTypes?.courseTypes?.forEach((admin, index) => {

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index+1}</td>
                    <td>${admin?.name}</td>
                    <td>${admin?.description}</td>
                    <td>${ new Date(admin?.createdAt).toLocaleString('en-IN')
                    }</td>
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
    const modal = new bootstrap.Modal(document.getElementById('addCourseType'));
    modal.show();

    const course = JSON.parse(button.getAttribute('data-course'));

    const courseName = document.getElementById('courseName').value = course.name;
    const description = document.getElementById('description').value = course.description;


    //
    const updateButton = document.getElementById('editButton');
    updateButton.classList.remove('hidden');
    const saveButton = document.getElementById('registerAdminButton');
    saveButton.classList.add('hidden');

    updateButton.textContent = 'Update';

    updateButton.onclick= async function (e) {

      e.preventDefault();
      const courseName = document.getElementById('courseName').value;
      const description = document.getElementById('description').value;

      const response = await fetch(`/api/course/all-type/${course._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: courseName,
            description: description,
          }),
      });

      const data = await response.json();
      if (response.ok) {
        fetchCourseType();
        modal.hide();
      } else {
          console.error('Error updating course type:', data.message);
      }
    }
  } catch (error) {
      console.error('Error updating course type:', error);
  }
}


async function deleteAdmin(adminId) {
  if(confirm('Are you want to delete?')) {
  try {
      const response = await fetch(`/api/course/all-type/${adminId}`, {
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
