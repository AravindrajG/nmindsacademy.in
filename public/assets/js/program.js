async function fetchAndRenderProjects() {
    try {
        const response = await fetch("/api/projects/get-projects"); // Adjust endpoint as per your API
        const projects = await response.json();

        const projectContainer = document.getElementById("projectsContainer"); // Ensure this div exists in your HTML
        projectContainer.innerHTML = ""; // Clear previous content

        projects?.data?.forEach(project => {
            const projectCard = `
                <div class="col-xl-4 col-lg-6 col-md-6">
                    <div class="popular-program-box-items box-shadow mt-0">
                        <div class="thumb">
                            <img src="${project.mainImage}" alt="${project.title}">
                        </div>
                        <div class="content">
                            <h3><a href="program-details.html?id=${project._id}">${project.title}</a></h3>
                            <p>${project.description}</p>
                            <a href="#" class="theme-btn enroll-btn" 
                                data-proof="${project.proof}" 
                                onclick="showProofModal(event)">View</a>
                        </div>
                    </div>
                </div>
            `;

            projectContainer.innerHTML += projectCard;
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
    }
}

function showProofModal(event) {
    event.preventDefault();

    const proofUrl = event.currentTarget.getAttribute("data-proof");
    const proofContent = document.getElementById("proofContent");

    // Determine if it's an image or PDF
    if (proofUrl.endsWith(".png") || proofUrl.endsWith(".jpg") || proofUrl.endsWith(".jpeg")) {
        proofContent.innerHTML = `<img src="${proofUrl}" class="img-fluid" alt="Proof Image">`;
    } else if (proofUrl.endsWith(".pdf")) {
        proofContent.innerHTML = `<embed src="${proofUrl}" type="application/pdf" width="100%" height="100vh" style="min-height: 100vh;">`;
    } else {
        proofContent.innerHTML = `<p>No valid proof file available.</p>`;
    }

    // Show Bootstrap modal
    const proofModal = new bootstrap.Modal(document.getElementById("proofModal"));
    proofModal.show();
}


// Call function when page loads
document.addEventListener("DOMContentLoaded", fetchAndRenderProjects);
