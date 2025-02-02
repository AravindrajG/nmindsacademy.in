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

document.getElementById('registerAdminButton').addEventListener('click', async function () {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Validation
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    alert('Please fill out all fields');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  try {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,

      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        role:'admin'
      }),
    });

    const result = await response.json();
    if (response.ok) {
      alert('Admin registered successfully');
      document.getElementById('admin-register-form').reset();
      const modalElement = document.getElementById('adminRegisterModal');
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


  async function deleteAdmin(adminId) {
    if(confirm('Are you want to delete?')) {
    try {
        const response = await fetch(`/api/admin/delete/${adminId}`, {
            method: 'DELETE',
            headers:{
              'Authorization': `Bearer ${token}`,
            }
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
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


  async function fetchCourseType() {
    try {
        const response = await fetch('/api/admin/get',{
          headers:{
            'Authorization': `Bearer ${token}`,
          }
        }
        );

        if (response.status === 401 || response.status === 403) {
            window.location.href = '/admin/index.html';
        }
        const admins = await response.json();


        if (response.ok) {
            const adminList = document.getElementById('admin-list');
            adminList.innerHTML = '';

            admins.forEach((admin, index) => {

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index+1}</td>
                    <td>${admin?.firstName}</td>
                    <td>${admin?.lastName}</td>
                    <td>${admin?.email}</td>
                    <td>${new Date(admin?.createdAt).toLocaleString('en-IN')
                    }</td>
                    <td>
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

document.getElementById('logout-btn').addEventListener('click', function () {

  localStorage.removeItem('authToken');
  localStorage.removeItem('admin');
  sessionStorage.removeItem('authToken');


  window.location.href = '/index.html';
});


document.addEventListener('DOMContentLoaded', fetchCourseType);
