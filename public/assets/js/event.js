// Function to fetch all events from the backend
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

    events.forEach((event) => {
      const eventItem = document.createElement("div");
      eventItem.classList.add("event-list-items");

      eventItem.innerHTML = `
        <div class="event-content">
          <div class="content">
            <div class="date">
              <h2>${new Date(event.fromDate).getDate()}</h2>
              <span>${new Date(event.fromDate).toLocaleString("default", {
                month: "short",
                year: "numeric",
              })}</span>
            </div>
            <div class="title-text">
              <h4><a href="event-details.html?id=${event._id}">${event.title}</a></h4>
              <ul class="post-time">
                <li><i class="far fa-map-marker-alt"></i>${event.location}</li>
                <li><i class="far fa-clock"></i>${event.startTime}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="event-image">
            <img src="${event.image}" alt="img" style="width: 240px; height: 148px; object-fit: cover;">
        </div>
        <div class="event-btn">
          <a href="event-details.html?id=${event._id}" class="theme-btn">Book A Seat</a>
        </div>
      `;

      // Append the event item to the container
      eventListContainer.appendChild(eventItem);
    });
  }

  // Fetch events when the page loads
  document.addEventListener("DOMContentLoaded", fetchEvents);
