

document.getElementById("contact-form").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent the default form submission


    // Gather form data
    const formData = {
        firstName: document.getElementById("name").value.trim(),
        lastName: document.getElementById("name12").value.trim(),
        email: document.getElementById("email3").value.trim(),
        password: document.getElementById("password").value.trim(),
        confirmPassword: document.getElementById("confirm-password").value.trim(),
    };

    // Client-side validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
        alert("All fields are required!");
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
        alert("Please enter a valid email address.");
        return;
    }

    try {
        // Send data to the server
        const response = await fetch('/api/users/register', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message); // Success message from server
            document.getElementById("contact-form").reset(); // Reset the form
        } else {
            const error = await response.json();
            alert(error.message || "Something went wrong.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
    }
});
