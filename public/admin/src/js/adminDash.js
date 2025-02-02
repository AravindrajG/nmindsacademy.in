
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


//  document.getElementById('gallery-form').addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     const title = document.querySelector('[name="title"]').value;
//     const description = document.querySelector('[name="description"]').value;
//     const images = document.querySelector('[name="images"]').files;

//     formData.append('title', title);
//     formData.append('description', description);

//     for (let i = 0; i < images.length; i++) {
//       formData.append('images', images[i]);
//     }

//     const response = await fetch('/api/gallery/create', {
//       method: 'POST',
//       body: formData,
//     });

//     const result = await response.json();
//     if (response.ok) {
//       alert('Gallery created successfully!');
//     } else {
//       alert('Error creating gallery: ' + result.message);
//     }
//   });

const dashBoardCards = async () => {
  try{
  const response = await fetch('/api/admin/dashBoard',
    {
      headers: {
        'Authorization': `Bearer ${token}`,
    }
    }
  )
    const data = await response.json();
    if (data.success) {
      document.querySelector('#totalCourse').textContent = data.data.totalCourses;
      document.querySelector('#totalAdmins').textContent = data.data.totalAdmins;
      document.querySelector('#totalStudents').textContent = data.data.totalStudents;
    }
  }
  catch(error)  {
    console.error('Error fetching stats:', error)
    if(data?.redirect){
      window.href= data.redirect
    }
  };
}

dashBoardCards();


const getStudents = async () => {
  try{
    const response = await fetch('/api/admin/students',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
      }
      }
    )


    if (response.status === 401 || response.status === 403) {
      window.location.href = '/admin/index.html';
  }
  const students = await response.json();

  console.log(students)
  if (response.ok) {
      const table = document.getElementById('student-table');

      table.innerHTML = '';

      students?.data.forEach((student, index) => {

          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${index+1}</td>
              <td>${student?.firstName}</td>
              <td>${student?.lastName}</td>
              <td>${student?.email}</td>
              <td>${new Date(student?.createdAt).toLocaleDateString('in') }</td>
          `;
          table.appendChild(row);
      });
  } else {
      alert('Error fetching admins');
  }
  } catch(e) {
    console.log(e);


  }
}

getStudents();

  // Fetch the gallery data and display the carousel
// async function fetchGalleries() {
//     try {
//       const response = await fetch('/api/gallery/get'); // Fetch galleries from backend
//       const data = await response.json();

//       if (response.ok) {
//         const galleries = data.galleries;
//         const carouselImagesContainer = document.getElementById('carouselImages');



  //       // Loop through each gallery to create a carousel item
  //       galleries.forEach((gallery, index) => {
  //         gallery.images.forEach((image, i) => {
  //           const isActive = (index === 0 && i === 0) ? 'active' : ''; // Make the first image active
  //           const carouselItem = `
  //             <div class="carousel-item ${isActive}">
  //               <img src="${image.url}" class="d-block w-100" alt="${image.altText}">
  //             </div>
  //             <div >
  //               <button class="btn btn-danger mt-2 ms-auto" class="deleteCarouselBtn">Delete</button>
  //             </div>
  //           `;

  //           carouselImagesContainer.innerHTML += carouselItem;
  //         });
  //       });

  //       const deleteButton = document.getElementsByClassName('deleteCarouselBtn');
  //       deleteButton.onclick = async () => {
  //           console.log(galleries[0]);
  //           const confirmed = confirm('Are you sure you want to delete this carousel?');
  //           if (confirmed) {
  //             try {
  //               const deleteResponse = await fetch(`/api/gallery/delete/${galleries[0]._id}`, {
  //                 method: 'DELETE',
  //               });
  //               const deleteData = await deleteResponse.json();
  //               if (deleteResponse.ok) {
  //                 alert('Carousel deleted successfully');
  //                 document.getElementById('adminCarousel').remove();
  //               } else {
  //                 alert(deleteData.message);
  //               }
  //             } catch (error) {
  //               console.error('Error deleting carousel:', error);
  //               alert('Error deleting carousel');
  //             }
  //           }
  //         };
  //     } else {
  //       alert('Error fetching galleries: ' + data.message);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching galleries:', error);
  //     alert('Error fetching galleries');
  //   }
  // }

  // fetchGalleries();


  document.getElementById('logout-btn').addEventListener('click', function () {
    // Clear token from localStorage/sessionStorage
    localStorage.removeItem('authToken');
  localStorage.removeItem('admin');
    sessionStorage.removeItem('authToken');

    // Redirect to login page
      window.location.href = '/index.html';

  });