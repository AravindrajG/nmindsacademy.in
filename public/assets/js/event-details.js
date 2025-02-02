async function fetchCourseDetails(eventId) {
    try {
        const url = eventId
            ? `/api/events/get/${eventId}` // Replace with your backend URL
            : `/api/events/random`; // Fetch random event if no ID

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch event details.");
        }

        const event = await response.json();
        populateEventDetails(event);
    } catch (error) {
        console.error("Error fetching event details:", error);
        alert("Unable to load event details. Please try again later.");
    }
}

function convertTo12HourFormat(time) {
    const [hours, minutes] = time.split(":").map(Number); // Split and parse the time
    const period = hours >= 12 ? "PM" : "AM";
    const adjustedHours = hours % 12 || 12; // Convert 0 or 12-hour to 12-hour format
    return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

function populateEventDetails(event) {
    document.getElementById("start-date").textContent = new Date(event.fromDate).toLocaleDateString("hi-IN");
    document.getElementById("end-date").textContent = new Date(event.toDate).toLocaleDateString("hi-IN");
    document.getElementById("start-time").textContent = event.startTime
    ? convertTo12HourFormat(event.startTime)
    : "";
    document.getElementById("end-time").textContent = event.endTime
    ? convertTo12HourFormat(event.endTime)
    : "";

    document.getElementById("location").textContent = event.location || '';
    document.getElementById("ticket-price").textContent = event?.ticketPrice && '₹'+event?.ticketPrice || "Free";
    document.getElementById("total-seat").textContent = event.studentsCount || '';
    const mapCont = document.getElementById('map-area');
    mapCont.innerHTML = `<iframe src=${event?.map} style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;

    const title = document.getElementById('breadcrumb-content');
    title.innerHTML = `<h1>${event?.title}</h1>`
    const img = document.getElementById('details-image');
    img.innerHTML = `<img src="uploads/${event?.image}" alt="img" style="max-width: 1200px; max-height: 713px; width: 100%; height: auto; object-fit: cover;">`;
    console.log(event?.image);

    const eventDescription = document.getElementById("event-description");
    eventDescription.innerHTML = `
      <h3>Event Description</h3>
      <p class="mb-4">${event.description || "No description available."}</p>
      <h3>What You Will Learn</h3>
      <ul class="details-list">
        ${(event.learningOutcomes || [])
          .map(
            (topic) =>
              `<li><i class="fas fa-check-circle"></i>${topic}</li>`
          )
          .join("")}
      </ul>
    `;
    const bookBtn = document.getElementById("book-btn");
    bookBtn.href = `event-details.html?id=${event._id}`;

    initializeTimer(new Date(event.fromDate));
}


function initializeTimer(eventDate) {
    function updateTimer() {
        const now = new Date();
        const timeLeft = eventDate - now;

        if (timeLeft < 0) {
            clearInterval(timerInterval);
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        document.getElementById("day").textContent = days.toString().padStart(2, "0");
        document.getElementById("hour").textContent = hours.toString().padStart(2, "0");
        document.getElementById("min").textContent = minutes.toString().padStart(2, "0");
        document.getElementById("sec").textContent = seconds.toString().padStart(2, "0");
    }

    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer(); // Initialize immediately
}

// Fetch and display event details
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get("id");
fetchCourseDetails(eventId);


document.getElementById('shareButton').addEventListener('click', function () {
    const currentPageUrl = window.location.href;

    const shareData = {
        title: document.title,
        text: 'Check out this page!',
        url: currentPageUrl,
    };

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Page shared successfully!'))
            .catch((error) => console.error('Error sharing:', error));
    } else {
        navigator.clipboard.writeText(currentPageUrl)
            .then(() => alert('Link copied to clipboard!'))
            .catch((error) => console.error('Error copying to clipboard:', error));
    }
});