const urlParams = new URLSearchParams(window.location.search);
const blogId = urlParams.get('id');

async function fetchBlogDetails() {
  try {
    const url = blogId
      ? `/api/blogs/blog/` + blogId
      : `/api/blogs/random`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();


    document.getElementById('blog-title').textContent = data.blog.title;
    document.getElementById('blog-author').textContent = `By ${data.blog.author}`;
    document.getElementById('blog-date').textContent = new Date(data.blog.date).toLocaleDateString();
    document.getElementById('blog-main-content').textContent = data.blog.mainContent;
    document.getElementById('blog-image').src =`uploads/${data.blog.mainImage}`;
    document.getElementById('subheading').textContent = data.blog.subheading;
    document.getElementById('additional-content').textContent = data.blog.additionalContent;
    document.getElementById('quote').textContent = data.blog.quote;

    const bulletsList = document.getElementById('bullets');
    bulletsList.innerHTML = '';
    data?.blog?.bullets.forEach(bullet => {
      const li = document.createElement('li');
      li.textContent = bullet;
      bulletsList.appendChild(li);
    });
    document.getElementById('subheadingH4').textContent = data?.blog?.subheadingH4;

    const tagCloud = document.getElementById('tagCloud');
            tagCloud.innerHTML = '';

            data.blogCategory.forEach(tag => {
                const a = document.createElement('a');
                a.href = "/news.html";
                a.textContent = tag.name;
                tagCloud.appendChild(a);
            });

  } catch (error) {
    console.error('Error fetching blog details:', error);
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

    // Loop through the blogs and create HTML dynamically
    blogs.forEach(blog => {
      const postItem = document.createElement('div');
      postItem.classList.add('single-post-item');

      const thumbDiv = document.createElement('div');
      thumbDiv.classList.add('thumb');
      thumbDiv.style.backgroundImage = `url(${blog.mainImage})`;

      const contentDiv = document.createElement('div');
      contentDiv.classList.add('post-content');

      const title = document.createElement('h5');
      const link = document.createElement('a');
      link.href = `news-details.html?id=${blog._id}`;
      link.textContent = blog.title;
      title.appendChild(link);

      const dateDiv = document.createElement('div');
      dateDiv.classList.add('post-date');
      dateDiv.innerHTML = `<i class="far fa-calendar-alt"></i>${new Date(blog.date).toLocaleDateString()}`;

      contentDiv.appendChild(title);
      contentDiv.appendChild(dateDiv);

      postItem.appendChild(thumbDiv);
      postItem.appendChild(contentDiv);

      postsContainer.appendChild(postItem);
    });
  } catch (error) {
    console.error('Error fetching latest blogs:', error);
  }
}

document.addEventListener('DOMContentLoaded', fetchLatestBlogs);

document.addEventListener('DOMContentLoaded', fetchBlogDetails);