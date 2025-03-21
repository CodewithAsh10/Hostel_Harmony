// Function to create the navigation bar
function createNavbar() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const navbar = document.createElement('nav');
    navbar.className = 'navbar navbar-expand-lg navbar-dark';
    navbar.style.background = 'linear-gradient(135deg, #3b82f6, #a855f7)';
    navbar.innerHTML = `
        <div class="container-fluid">
            <a class="navbar-brand" href="index.html">Hostel Harmony</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" href="index.html">Report Issue</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="dashboard.html">Dashboard</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="forum.html">Forum</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="feedback.html">Feedback</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="about.html">About</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="contact.html">Contact Us</a>
                    </li>
                    ${currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Hostel Warden') ? `
                        <li class="nav-item">
                            <a class="nav-link" href="admin.html">Admin Panel</a>
                        </li>
                    ` : ''}
                </ul>
                <div class="d-flex">
                    ${currentUser ? `
                        <span class="navbar-text me-3">Welcome, ${currentUser.username} (${currentUser.role})</span>
                        <button id="logout-btn" class="btn btn-outline-light">Logout</button>
                    ` : `
                        <a href="auth.html" class="btn btn-outline-light">Login/Sign Up</a>
                    `}
                </div>
            </div>
        </div>
    `;

    document.body.insertBefore(navbar, document.body.firstChild);

    // Handle logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'auth.html';
        });
    }
}

// Call the function to create the navbar on page load
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.createElement('nav');
    navbar.className = 'navbar navbar-expand-lg navbar-light fixed-top';

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    navbar.innerHTML = `
        <div class="container-fluid">
            <a class="navbar-brand" href="index.html">Hostel Harmony</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="dashboard.html">Dashboard</a></li>
                    <li class="nav-item"><a class="nav-link" href="feedback.html">Feedback</a></li>
                    <li class="nav-item"><a class="nav-link" href="about.html">About</a></li>
                    <li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>
                    ${currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Hostel Warden') ? '<li class="nav-item"><a class="nav-link" href="admin.html">Admin</a></li>' : ''}
                </ul>
                <span class="navbar-text">
                    ${currentUser ? `Welcome, ${currentUser.username} (${currentUser.role}) | <a href="#logout" id="logout-link">Logout</a>` : '<a href="auth.html">Login / Sign Up</a>'}
                </span>
            </div>
        </div>
    `;

    document.body.insertBefore(navbar, document.body.firstChild);

    // Handle logout
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'auth.html';
        });
    }
});