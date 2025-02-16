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

    // Get form data
    const title = document.getElementById("courseName").value.trim();
    const description = document.getElementById("description").value.trim();
    const imageInput = document.getElementById("image");
    const proofInput = document.getElementById("proof");

    if (!title || !description || !imageInput.files.length || !proofInput.files.length) {
        alert("Please fill in all fields!");
        return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", imageInput.files[0]);
    formData.append("proof", proofInput.files[0]);

    try {
        const response = await fetch("/api/projects/add", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });


        const result = await response.json();

        if (response.ok) {
            alert("Project added successfully!");
            fetchProjects();
            document.querySelector("#addProject .btn-close").click();
            document.getElementById('coursetype-register-form').reset();
        } else {
            alert(result.message || "Error adding project.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
    }

});

async function fetchProjects() {
    try {
        const response = await fetch('/api/projects/get', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const courseTypes = await response.json();
        console.log(courseTypes);

        if (response.ok) {
            const adminList = document.getElementById('admin-list');
            adminList.innerHTML = '';

            courseTypes?.data?.forEach((admin, index) => {

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${admin?.title}</td>
                    <td>${admin?.proof}</td>
                    <td> 
                    <img src="/uploads/${admin?.mainImage}" alt="img" style="width: 50px; height: 50px; object-fit: cover;">
                    </td>
                    <td>
                        ${admin?.proof.endsWith('.pdf')
                            ? `<a href="/uploads/${admin.proof}" target="_blank">View pdf</a>`
                            : `<img src="/uploads/${admin.proof}" alt="proof image" style="width: 50px; height: 50px; object-fit: cover; cursor: pointer;" onclick="openImageModal('/uploads/${admin.proof}')">`
                        }
                    </td>

                    <td>
                        <button class="btn btn-warning btn-sm" data-project='${JSON.stringify(admin)}' onclick="editCourse(this)">Edit</button>
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
        const modal = new bootstrap.Modal(document.getElementById('addProject'));
        modal.show();

        const project = JSON.parse(button.getAttribute('data-project'));


        // Populate form fields with existing project data
        document.getElementById('courseName').value = project.title;
        document.getElementById('description').value = project.description;



        // Show update button and hide add button
        const updateButton = document.getElementById('editButton');
        updateButton.classList.remove('hidden');
        const saveButton = document.getElementById('registerAdminButton');
        saveButton.classList.add('hidden');
        updateButton.textContent = 'Update';

        // Define the token for authentication
        const token = localStorage.getItem('authToken');

        // Set up click handler for update button
        updateButton.onclick = async function (e) {
            e.preventDefault();

            // Get updated values
            const projectTitle = document.getElementById('courseName').value;
            const projectDescription = document.getElementById('description').value;
            const imageFile = document.getElementById('image')?.files[0]; // New image
            const proofFile = document.getElementById('proof')?.files[0]; // New proof


            // Use FormData for image uploads
            const formData = new FormData();
            formData.append('title', projectTitle);
            formData.append('description', projectDescription);
            if (imageFile) formData.append('mainImage', imageFile);
            if (proofFile) formData.append('proof', proofFile);

            try {
                const response = await fetch(`/api/projects/update/${project._id}`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}` }, // No need for 'Content-Type'
                    body: formData, // Send FormData
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Update successful:', data);
                    fetchProjects();
                    document.getElementById('coursetype-register-form').reset();
                    modal.hide();
                } else {
                    const error = await response.json();
                    console.error('Update failed:', error);
                    alert(`Error: ${error.message}`);
                }
            } catch (fetchError) {
                console.error('Error sending data to server:', fetchError);
                alert('An error occurred while updating the project.');
            }
        };
    } catch (error) {
        console.error('Error preparing project edit modal:', error);
        alert('Failed to prepare project editing.');
    }
}

async function deleteAdmin(adminId) {
    if (confirm('Are you want to delete?')) {
        try {
            const response = await fetch(`/api/projects/delete/${adminId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            const result = await response.json();
            if (response.ok) {
                fetchProjects();
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

document.addEventListener('DOMContentLoaded', fetchProjects);
