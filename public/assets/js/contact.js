
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Capture form data
    const formData = new FormData(this);

    // Convert form data to a JSON object
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Send the data to the server using fetch
    fetch(route+'/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Send form data as JSON
    })
    .then(response => response.json())
    .then(data => {
        alert('Message sent successfully!');
        // You can handle the success message here (e.g., reset form or show success notification)
    })
    .catch(error => {
        alert('Error sending message. Please try again later.');
        console.error('Error:', error);
    });
});
