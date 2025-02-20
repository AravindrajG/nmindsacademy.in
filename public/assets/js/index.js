async function fetchEvents() {
    const eventsContainer = document.getElementById("eventsContainer");
    eventsContainer.innerHTML = '';

    const response = await fetch("/api/events/recent");
    const events = await response.json();

    events.forEach(event => {
      const eventHTML = `
        <div class="event-box-items wow fadeInUp">
          <div class="accordion-single active">
            <div class="header-area">
              <div class="accordion-btn">
                <div class="content-items">
                  <div class="post-date">
                    <span>${new Date(event.fromDate).getDate()+" "+new Date(event.fromDate).toLocaleString("default", {
                      month: "short",
                      year: "numeric",
                    })}</span>
                  </div>
                  <div class="content">
                    <h5><a href="/event-details.html?id=${event._id}">${event.title}</a></h5>
                  </div>
                </div>
                <div class="event-image">
                  <img src="${event.image}" alt="Event Image" style="width: 240px; height: 148px; object-fit: cover;">
                </div>
                <ul class="button-list">
                  <li>
                    <i class="far fa-map-marker-alt"></i>
                    ${event.location}
                  </li>
                  <li>
                    <a href="event-details.html?id=${event._id}" class="theme-btn">View Events</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      `;
      eventsContainer.innerHTML += eventHTML;
    });


}
fetchEvents();

async function fetchCourses() {
  try {
    const apiUrl = '/api/course/all-courses';
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log(data);

      if (response.ok) {
          const courses = data;
          const swiperContainer = document.querySelector('#swiper-wrapper');
          swiperContainer.innerHTML = '';
          courses.forEach(course => {
            const courseHTML = `
                <div class="swiper-slide">
                    <div class="live-courses-main-items">
                       <div class="live-courses-items bg-cover" style="background-image: url('${course.image}'); padding: 5px; height: 300px; background-size: cover; background-position: center;">
                            <div class="live-courses-content mt-3">
                                <h3>
                                    <span>${course.title.split(" ")[0]}</span>
                                    ${course.title.split(" ").slice(1).join(" ")}
                                </h3>
                                
                            </div>
                           
                        </div>
                        <div class="content mt-3">
                            <h4><a href="/courses-details.html?id=${course._id}">${course.title}</a></h4>
                            <ul class="list">
                                <li>
                                    <i class="fal fa-user-clock"></i>
                                    ${course.instructor}
                                </li>
                                <li>
                                    <i class="far fa-clock"></i>
                                    ${course.duration}
                                </li>
                                <li>
                                    <i class="far fa-user"></i>
                                    ${course.studentsCount} Students
                                </li>
                            </ul>
                            <a href="/courses-details.html?id=${course._id}" class="theme-btn">View Course</a>
                        </div>
                    </div>
                </div>
            `;
            swiperContainer.innerHTML += courseHTML;
        });
          } else {
          alert('Error fetching courses: ' + data.message);
      }
  } catch (error) {
      console.error('Error fetching courses:', error);
      alert('Error fetching courses');
  }
}
fetchCourses();

async function fetchLatestBlogs() {
  try {
    const response = await fetch('/api/blogs/latest');

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const blogs = await response.json();

    const newsContainer = document.getElementById('newsContainer');

    // Start the delay from 0.2s, and increase for each card
    let delay = 0.2;

    blogs.forEach((news, index) => {
        const cardHTML = `
            <div class="col-xl-3 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="${delay}s">
                <div class="news-card-items">
                    <div class="news-image">
                        <img src="${news.mainImage}" alt="img">
                        <img src="${news.mainImage}" alt="img">
                        <div class="post-cat">${news?.blogCategory?.name || ''}</div>
                    </div>
                    <div class="news-content">
                        <ul class="post-meta">
                            <li>
                                <i class="far fa-calendar-alt"></i>
                                ${new Date(news.date).toLocaleDateString('in')}
                            </li>
                            <li>
                                <i class="far fa-user"></i>
                                ${news.author}
                            </li>
                        </ul>
                        <h5>
                            <a href="/news-details.html?id=${news._id}">
                                ${news.title}
                            </a>
                        </h5>
                        <a href="/news-details.html?id=${news._id}" class="link-btn">Read More <i
                                class="far fa-chevron-double-right"></i></a>
                    </div>
                </div>
            </div>
        `;
        newsContainer.innerHTML += cardHTML;

        delay += 0.2;
    });
  } catch (error) {
    console.error('Error fetching latest blogs:', error);
  }
}

fetchLatestBlogs();