async function fetchBlogs() {
    try {
      const response = await fetch('/api/blogs/getBlogs'); // Assuming your API endpoint is /api/blogs
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blogs = await response.json(); // Parse the JSON response

      // Get the container where you want to render the blogs
      const blogContainer = document.getElementById('blog-container');

      // Clear the container before adding new blogs
      blogContainer.innerHTML = '';

      // Loop through each blog and render it
      blogs.forEach(blog => {
        // Create the HTML structure dynamically
        const blogHTML = `
          <div class="single-blog-post mb-3">
            <div class="post-featured-thumb bg-cover" style="background-image: url('${blog.mainImage}'); background-size: 1200px 713px;"></div>
            <div class="post-content">
              <div class="post-meta">
                <span><i class="fal fa-calendar-alt"></i>${new Date(blog.date).toLocaleDateString('ind')}</span>
                <span style=" opacity:0.2; color:black;">${blog?.blogCategory?.name || ''}</span>
                </div>
              <h2 class="title-anim">
                <a href="news-details.html?id=${blog._id}">${blog.title}</a>
              </h2>
              <p>${blog.mainContent.substring(0, 200)}...</p>
              <a href="news-details.html?id=${blog._id}" class="theme-btn mt-4 line-height">Read More</a>
            </div>
          </div>
        `;

        // Append the blog to the container
        blogContainer.innerHTML += blogHTML;
      });
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  }

  async function fetchLatestBlogs() {
    try {
      const response = await fetch('/api/blogs/latest');

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blogs = await response.json();

      const postsContainer = document.getElementById('latest-posts');
      postsContainer.innerHTML = ''; // Clear any existing posts

      blogs.forEach(blog => {
        const postItem = document.createElement('div');
        postItem.classList.add('single-post-item');

        const thumbDiv = document.createElement('div');
        thumbDiv.classList.add('thumb');
        thumbDiv.style.backgroundImage = `url(${blog?.mainImage})`;

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('post-content');

        const title = document.createElement('h5');
        const link = document.createElement('a');
        link.href = `news-details.html?id=${blog._id}`; // Link to the blog details page with the blog ID in the URL
        link.textContent = blog.title; // Set the blog title
        title.appendChild(link);

        const dateDiv = document.createElement('div');
        dateDiv.classList.add('post-date');
        dateDiv.innerHTML = `<i class="far fa-calendar-alt"></i>${new Date(blog.date).toLocaleDateString()}`; // Format the date

        contentDiv.appendChild(title);
        contentDiv.appendChild(dateDiv);

        postItem.appendChild(thumbDiv);
        postItem.appendChild(contentDiv);

        postsContainer.appendChild(postItem); // Append the post item to the container
      });
    } catch (error) {
      console.error('Error fetching latest blogs:', error);
    }
  }

  // Call the function when the page loads
  document.addEventListener('DOMContentLoaded', fetchLatestBlogs);

  // Call the fetchBlogs function when the page loads
  document.addEventListener('DOMContentLoaded', fetchBlogs);