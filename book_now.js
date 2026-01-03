// Example of how to send data from your "Book Now" form
async function submitBooking(formData) {
    try {
        const response = await fetch('http://localhost:5000/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error("Error submitting booking:", error);
    }
}