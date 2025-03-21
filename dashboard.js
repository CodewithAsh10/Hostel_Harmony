// Check if user is logged in
window.onload = function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }

    loadComplaints();
    loadAnnouncements(); // Add this to load announcements
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

// Load complaints into separate sections
function loadComplaints() {
    let complaints = JSON.parse(localStorage.getItem('complaints')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Filter complaints by status
    const pendingComplaints = complaints.filter(complaint => complaint.status === 'Pending');
    const inProgressComplaints = complaints.filter(complaint => complaint.status === 'In Progress');
    const resolvedComplaints = complaints.filter(complaint => complaint.status === 'Resolved');

    // Get DOM elements for each section
    const pendingList = document.getElementById('pendingComplaints');
    const inProgressList = document.getElementById('inProgressComplaints');
    const resolvedList = document.getElementById('resolvedComplaints');

    // Clear existing content
    pendingList.innerHTML = '';
    inProgressList.innerHTML = '';
    resolvedList.innerHTML = '';

    // Function to render complaints for a given list
    function renderComplaints(complaintList, listElement) {
        complaintList.forEach(complaint => {
            const complaintItem = document.createElement('li');
            complaintItem.classList.add('list-group-item');
            complaintItem.innerHTML = `
                <div>
                    <strong>${complaint.name}</strong> (Room ${complaint.room}, Block ${complaint.block}, Hostel ${complaint.hostel})
                    <br>Category: ${complaint.category}
                    <br>Issue: ${complaint.complaint}
                    <span class="status-badge ${complaint.status.toLowerCase().replace(' ', '-')}">${complaint.status}</span>
                    <span class="priority-badge ${complaint.priority.toLowerCase()}">${complaint.priority}</span>
                </div>
                ${complaint.media ? `
                    <div>
                        ${complaint.media.includes('image') ? `<img src="${complaint.media}" class="media-preview" alt="Complaint Media">` : `<video src="${complaint.media}" class="media-preview" controls></video>`}
                    </div>
                ` : ''}
                <div class="comment-section">
                    <h6>Comments:</h6>
                    <div class="comments" id="comments-${complaint.id}">
                        ${complaint.comments.map(comment => `
                            <div class="comment">
                                <strong>${comment.author}</strong> (${comment.role}): ${comment.text} <small>(${new Date(comment.timestamp).toLocaleString()})</small>
                            </div>
                        `).join('')}
                    </div>
                    ${(currentUser.role === 'Hostel Warden' || currentUser.role === 'Admin') ? `
                        <form class="comment-form" data-id="${complaint.id}">
                            <input type="text" class="form-control" placeholder="Add a comment..." required>
                            <button type="submit" class="btn btn-primary btn-sm">Post</button>
                        </form>
                    ` : ''}
                </div>
            `;
            listElement.appendChild(complaintItem);
        });

        // Add message if no complaints in this section
        if (complaintList.length === 0) {
            const noComplaintsItem = document.createElement('li');
            noComplaintsItem.classList.add('list-group-item');
            noComplaintsItem.innerHTML = '<p class="text-center text-secondary">No issues in this category.</p>';
            listElement.appendChild(noComplaintsItem);
        }
    }

    // Render complaints for each section
    renderComplaints(pendingComplaints, pendingList);
    renderComplaints(inProgressComplaints, inProgressList);
    renderComplaints(resolvedComplaints, resolvedList);

    // Handle comment submissions
    document.querySelectorAll('.comment-form').forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const complaintId = this.dataset.id;
            const commentText = this.querySelector('input').value;
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));

            let complaints = JSON.parse(localStorage.getItem('complaints')) || [];
            const complaint = complaints.find(c => c.id === complaintId);
            if (complaint) {
                complaint.comments.push({
                    author: currentUser.username,
                    role: currentUser.role,
                    text: commentText,
                    timestamp: Date.now()
                });
                localStorage.setItem('complaints', JSON.stringify(complaints));
                loadComplaints();
            }
        });
    });
}

// Load announcements for all users
function loadAnnouncements() {
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    const announcementList = document.getElementById('announcement-list');
    announcementList.innerHTML = '';

    if (announcements.length === 0) {
        const noAnnouncementsItem = document.createElement('li');
        noAnnouncementsItem.classList.add('list-group-item');
        noAnnouncementsItem.innerHTML = '<p class="text-center text-secondary">No announcements yet.</p>';
        announcementList.appendChild(noAnnouncementsItem);
        return;
    }

    announcements.forEach(announcement => {
        const announcementItem = document.createElement('li');
        announcementItem.classList.add('announcement-item');
        announcementItem.innerHTML = `
            <div>
                <strong>${announcement.title}</strong>
                <p>${announcement.content}</p>
                <small>Posted by ${announcement.author} on ${new Date(announcement.timestamp).toLocaleString()}</small>
            </div>
        `;
        announcementList.appendChild(announcementItem);
    });
}