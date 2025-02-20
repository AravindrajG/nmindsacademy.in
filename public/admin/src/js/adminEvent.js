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


 document.getElementById("addEventForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
        const response = await fetch("/api/events/add", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            alert("Event added successfully!");
            fetchEvents();
            e.target.reset();
            document.querySelector("#addEventModal .btn-close").click();
        } else {
            alert("Failed to add event. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while adding the event.");
    }
});

const addLearningOutcomeBtn = document.getElementById("addLearningOutcome");
const learningOutcomesContainer = document.getElementById("learningOutcomesContainer");

// Add a new learning outcome input field
addLearningOutcomeBtn.addEventListener("click", () => {
  const inputGroup = document.createElement("div");
  inputGroup.classList.add("input-group", "mb-3");

  inputGroup.innerHTML = `
    <input
      type="text"
      class="form-control"
      name="learningOutcomes[]"
      placeholder="Enter a learning outcome"
      required
    />
    <button type="button" class="btn btn-danger remove-learning-outcome">Remove</button>
  `;

  learningOutcomesContainer.appendChild(inputGroup);
});

// Remove a learning outcome input field
learningOutcomesContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-learning-outcome")) {
    const inputGroup = e.target.closest(".input-group");
    learningOutcomesContainer.removeChild(inputGroup);
  }
});



async function fetchEvents() {
  try {
    const response = await fetch("/api/events/get");
    if (!response.ok) {
      throw new Error("Failed to fetch events.");
    }
    const events = await response.json();
    addEventsToPage(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    alert("Unable to load events. Please try again later.");
  }
}

function addEventsToPage(events) {
  const eventListContainer = document.getElementById("event-list");
  eventListContainer.innerHTML = "";

  function convertTo12HourFormat(time) {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12;
    return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}
  events?.forEach((event, index) => {

      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${index+1}</td>
            <td>${event.title}</td>
            <td>${new Date(event.fromDate).toLocaleDateString('in')}</td>
          <td>${new Date(event.toDate).toLocaleDateString('in')}</td>
        <td>${convertTo12HourFormat(event.startTime)}</td>
        <td>${convertTo12HourFormat(event.endTime)}</td>
        <td><img src="${event.image}" alt="img" style="width: 50px; height: 50px; object-fit: cover;"></td>
          <td>
              <button class="btn btn-danger btn-sm" onclick="deleteCourse('${event?._id}')">Delete</button>
          </td>
      `;
      eventListContainer.appendChild(row);
  });

}

document.addEventListener("DOMContentLoaded", fetchEvents);

async function deleteCourse(eventId) {
  if (confirm('Are you sure you want to delete this course?')) {
      try {
          const response = await fetch(`/api/events/delete/${eventId}`, {
              method: 'DELETE',
          });
          const result = await response.json();

          if (response.ok) {
              alert(result.message);
              fetchEvents();
          } else {
              alert('Error deleting course: ' + result.message);
          }
      } catch (error) {
          console.error('Error:', error);
          alert('Failed to connect to the server.');
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