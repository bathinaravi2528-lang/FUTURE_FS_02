function toggleModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

document.getElementById('lead-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const notes = document.getElementById('notes').value;

    const leadData = {
        name,
        email,
        phone,
        source: 'Website Contact Form',
        notes
    };

    try {
        const response = await fetch('/api/leads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leadData)
        });

        if (response.ok) {
            document.getElementById('lead-form').reset();
            document.getElementById('form-success').style.display = 'block';
            setTimeout(() => {
                toggleModal('contact-modal');
                document.getElementById('form-success').style.display = 'none';
            }, 3000);
        } else {
            alert('Something went wrong. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting lead:', error);
        alert('Could not submit form. Please check your connection.');
    }
});
