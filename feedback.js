// Check if user is logged in
window.onload = function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }

    if (currentUser.role === 'Admin' || currentUser.role === 'Hostel Warden') {
        window.location.href = 'admin.html';
        return;
    }

    loadComplaintsForFeedback();
    loadFeedback();
    createBackgroundAnimations();
};

// Function to create background animations (particles and starfield)
function createBackgroundAnimations() {
    // Initialize Particles
    const particlesContainer = document.getElementById('particles');
    const numParticles = 30;
    const particles = [];

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particlesContainer.appendChild(particle);
        particles.push(particle);
    }

    function drawLines() {
        const linesContainer = document.createElement('div');
        linesContainer.className = 'lines';
        particlesContainer.appendChild(linesContainer);

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const distance = Math.hypot(
                    parseFloat(particles[i].style.left) - parseFloat(particles[j].style.left),
                    parseFloat(particles[i].style.top) - parseFloat(particles[j].style.top)
                );
                if (distance < 20) {
                    const line = document.createElement('div');
                    line.className = 'line';
                    const x1 = parseFloat(particles[i].style.left);
                    const y1 = parseFloat(particles[i].style.top);
                    const x2 = parseFloat(particles[j].style.left);
                    const y2 = parseFloat(particles[j].style.top);
                    const length = Math.hypot(x1 - x2, y1 - y2);
                    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
                    line.style.width = length + 'vw';
                    line.style.left = x1 + 'vw';
                    line.style.top = y1 + 'vh';
                    line.style.transform = `rotate(${angle}deg)`;
                    linesContainer.appendChild(line);
                }
            }
        }
    }

    drawLines();

    // Initialize Starfield
    const layers = [
        document.querySelector('.starfield-layer-1'),
        document.querySelector('.starfield-layer-2'),
        document.querySelector('.starfield-layer-3')
    ];
    const starCounts = [100, 60, 40]; // Number of stars per layer

    layers.forEach((layer, index) => {
        for (let i = 0; i < starCounts[index]; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 200 + 'vw'; // Wider range for movement
            star.style.top = Math.random() * 100 + 'vh';
            star.style.animationDelay = Math.random() * 3 + 's';
            layer.appendChild(star);
        }
    });
}

// Particle styles
const particleStyles = `
    .particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        animation: twinkle 5s infinite ease-in-out;
    }

    @keyframes twinkle {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.5); }
    }

    .line {
        position: absolute;
        height: 1px;
        background: rgba(255, 255, 255, 0.3);
        transform-origin: 0 0;
        animation: fadeLine 5s infinite ease-in-out;
    }

    @keyframes fadeLine {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.6; }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = particleStyles;
document.head.appendChild(styleSheet);

// Load resolved complaints for feedback
function loadComplaintsForFeedback() {
    const complaints = JSON.parse(localStorage.getItem('complaints')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const feedbackSelect = document.getElementById('feedback-complaint');

    // Filter resolved complaints for the current user that haven't been rated yet
    const resolvedComplaints = complaints.filter(complaint => 
        complaint.status === 'Resolved' && 
        complaint.name === currentUser.username && 
        !complaint.feedback // Only show complaints that haven't been rated
    );

    feedbackSelect.innerHTML = '<option value="" disabled selected>Select Complaint</option>';
    resolvedComplaints.forEach(complaint => {
        const option = document.createElement('option');
        option.value = complaint.id;
        option.textContent = `${complaint.category}: ${complaint.complaint} (Room ${complaint.room})`;
        feedbackSelect.appendChild(option);
    });

    // If no complaints are available for feedback, disable the form and show a message
    if (resolvedComplaints.length === 0) {
        feedbackSelect.disabled = true;
        document.getElementById('rating').disabled = true;
        document.getElementById('feedback-comment').disabled = true;
        document.querySelector('#feedback-form button').disabled = true;
        const message = document.createElement('p');
        message.className = 'text-center text-secondary mt-2';
        message.textContent = 'No resolved complaints available for feedback.';
        feedbackSelect.parentElement.appendChild(message);
    } else {
        // Ensure the form is enabled if there are complaints
        feedbackSelect.disabled = false;
        document.getElementById('rating').disabled = false;
        document.getElementById('feedback-comment').disabled = false;
        document.querySelector('#feedback-form button').disabled = false;
    }
}

// Handle feedback submission
document.getElementById('feedback-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const complaintId = document.getElementById('feedback-complaint').value;
    const rating = document.getElementById('rating').value;
    const comment = document.getElementById('feedback-comment').value;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!complaintId || !rating) {
        alert('Please select a complaint and provide a rating.');
        return;
    }

    let complaints = JSON.parse(localStorage.getItem('complaints')) || [];
    const complaint = complaints.find(c => c.id === complaintId);
    if (complaint) {
        complaint.feedback = {
            rating,
            comment,
            timestamp: Date.now(),
            user: currentUser.username
        };
        localStorage.setItem('complaints', JSON.stringify(complaints));

        let feedbackList = JSON.parse(localStorage.getItem('feedbackList')) || [];
        feedbackList.push({
            complaintId,
            category: complaint.category,
            complaint: complaint.complaint,
            room: complaint.room,
            rating,
            comment,
            timestamp: Date.now(),
            user: currentUser.username
        });
        localStorage.setItem('feedbackList', JSON.stringify(feedbackList));

        alert('Feedback submitted successfully!');
        this.reset();
        loadComplaintsForFeedback();
        loadFeedback();
    } else {
        alert('Error: Complaint not found.');
    }
});

// Handle suggestion submission
document.getElementById('suggestion-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const suggestion = document.getElementById('suggestion').value;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!suggestion) {
        alert('Please enter a suggestion.');
        return;
    }

    let suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];
    suggestions.push({
        suggestion,
        user: currentUser.username,
        timestamp: Date.now()
    });
    localStorage.setItem('suggestions', JSON.stringify(suggestions));

    alert('Suggestion submitted successfully!');
    this.reset();
    loadFeedback();
});

// Load previous feedback and suggestions
function loadFeedback() {
    const feedbackList = JSON.parse(localStorage.getItem('feedbackList')) || [];
    const suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const feedbackListElement = document.getElementById('feedback-list');
    feedbackListElement.innerHTML = '';

    // Display feedback
    feedbackList.forEach(feedback => {
        if (feedback.user === currentUser.username) {
            const feedbackItem = document.createElement('li');
            feedbackItem.classList.add('feedback-item');
            feedbackItem.innerHTML = `
                <div>
                    <strong>Complaint:</strong> ${feedback.category}: ${feedback.complaint} (Room ${feedback.room})
                    <br><strong>Rating:</strong> ${feedback.rating}/5
                    ${feedback.comment ? `<br><strong>Comment:</strong> ${feedback.comment}` : ''}
                    <br><small>Submitted on ${new Date(feedback.timestamp).toLocaleString()}</small>
                </div>
            `;
            feedbackListElement.appendChild(feedbackItem);
        }
    });

    // Display suggestions
    suggestions.forEach(suggestion => {
        if (suggestion.user === currentUser.username) {
            const suggestionItem = document.createElement('li');
            suggestionItem.classList.add('feedback-item');
            suggestionItem.innerHTML = `
                <div>
                    <strong>Suggestion:</strong> ${suggestion.suggestion}
                    <br><small>Submitted on ${new Date(suggestion.timestamp).toLocaleString()}</small>
                </div>
            `;
            feedbackListElement.appendChild(suggestionItem); // Fixed: Append to feedbackListElement
        }
    });

    // If no feedback or suggestions, show a message
    if (feedbackList.length === 0 && suggestions.length === 0) {
        const noFeedbackItem = document.createElement('li');
        noFeedbackItem.classList.add('list-group-item');
        noFeedbackItem.innerHTML = '<p class="text-center text-secondary">No feedback or suggestions submitted yet.</p>';
        feedbackListElement.appendChild(noFeedbackItem);
    }
}