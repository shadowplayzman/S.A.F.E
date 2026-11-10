// ============================================
// S.A.F.E. - SHELTER ALLOCATION SYSTEM
// ============================================

// ============================================
// 1. SHELTER DATA
// ============================================

const shelters = [
    {
        id: 1,
        name: "City Community Hall",
        city: "Ludhiana",
        capacity: 100,
        available: 45,
        facilities: ["Wheelchair Access", "Medical Support"]
    },
    {
        id: 2,
        name: "Northside Relief Centre",
        city: "Ludhiana",
        capacity: 80,
        available: 28,
        facilities: ["Food Services", "Family Rooms"]
    },
    {
        id: 3,
        name: "Community Relief Shelter",
        city: "Ludhiana",
        capacity: 60,
        available: 16,
        facilities: ["Medical Support", "Wheelchair Access"]
    },
    {
        id: 4,
        name: "Green Valley Emergency Centre",
        city: "Jalandhar",
        capacity: 120,
        available: 8,
        facilities: ["Food Services", "Medical Support"]
    },
    {
        id: 5,
        name: "Hope Community Shelter",
        city: "Chandigarh",
        capacity: 90,
        available: 0,
        facilities: ["Family Rooms", "Wheelchair Access"]
    },
    {
        id: 6,
        name: "Central Relief Facility",
        city: "Amritsar",
        capacity: 150,
        available: 65,
        facilities: [
            "Food Services",
            "Medical Support",
            "Family Rooms"
        ]
    }
];

// ============================================
// 2. LOCAL STORAGE
// ============================================

function loadAvailability() {
    const raw = localStorage.getItem("safeShelterAvailability");
    if (!raw) return;

    try {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved)) {
            shelters.forEach(shelter => {
                const match = saved.find(s => Number(s.id) === Number(shelter.id));
                if (match && typeof match.available === 'number') {
                    shelter.available = match.available;
                }
            });
        } else if (typeof saved === 'object') {
            shelters.forEach(shelter => {
                if (typeof saved[shelter.id] === 'number') {
                    shelter.available = saved[shelter.id];
                }
            });
        }
    } catch (e) {
        console.error("Error loading availability:", e);
    }
}

function saveAvailability() {
    const availability = {};
    shelters.forEach(shelter => {
        availability[shelter.id] = shelter.available;
    });
    localStorage.setItem(
        "safeShelterAvailability",
        JSON.stringify(availability)
    );
}

function getRequests() {
    return JSON.parse(
        localStorage.getItem("safeAllocationRequests") || "[]"
    );
}

loadAvailability();

// ============================================
// 3. SHELTER DETAILS
// ============================================

function viewShelter(shelterId) {
    const shelter = shelters.find(
        item => Number(item.id) === Number(shelterId)
    );

    if (!shelter) return;

    alert(
        `SHELTER DETAILS\n\n` +
        `Name: ${shelter.name}\n` +
        `City: ${shelter.city}\n` +
        `Available spaces: ${shelter.available}\n` +
        `Total capacity: ${shelter.capacity}\n` +
        `Facilities: ${shelter.facilities.join(", ")}`
    );
}

// ============================================
// 4. ALLOCATION FORM REFERENCES
// ============================================

const allocationSection = document.getElementById("allocation-section");
const allocationForm = document.getElementById("allocation-form");
const allocationMessage = document.getElementById("allocation-message");

// ============================================
// 5. OPEN ALLOCATION FORM (WITH AUTO-REDIRECT)
// ============================================

function openAllocationForm(shelterId) {
    const shelter = shelters.find(item => Number(item.id) === Number(shelterId));

    if (!shelter) return;

    if (shelter.available <= 0) {
        alert("This shelter currently has no available spaces.");
        return;
    }

    // If allocation form isn't on the current page (e.g. shelters.html), redirect to index.html
    if (!allocationSection || !allocationForm) {
        sessionStorage.setItem("selectedShelterId", shelterId);
        window.location.href = `index.html?shelterId=${shelterId}#allocation-section`;
        return;
    }

    const shelterIdInput = document.getElementById("selected-shelter-id");
    const shelterInfoEl = document.getElementById("allocation-shelter-info");
    const peopleInput = document.getElementById("allocation-people");

    if (shelterIdInput) shelterIdInput.value = shelter.id;

    if (shelterInfoEl) {
        shelterInfoEl.innerHTML = `
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
                <strong>Selected Shelter:</strong> ${shelter.name} (${shelter.city})<br>
                <small>Available Spaces: ${shelter.available} / ${shelter.capacity}</small>
            </div>
        `;
    }

    if (peopleInput) peopleInput.value = 1;
    if (allocationMessage) allocationMessage.innerHTML = "";

    allocationSection.hidden = false;
    allocationSection.scrollIntoView({ behavior: "smooth" });
}

// ============================================
// 6. SHELTER DIRECTORY
// ============================================

const shelterList = document.getElementById("shelter-list");

if (shelterList) {
    const searchInput = document.getElementById("shelter-search");
    const facilityFilter = document.getElementById("facility-filter");
    const availabilityFilter = document.getElementById("availability-filter");
    const resultsCount = document.getElementById("results-count");
    const noResults = document.getElementById("no-results");

    function displayShelters() {
        const searchText = searchInput ? searchInput.value.trim().toLowerCase() : "";
        const selectedFacility = facilityFilter ? facilityFilter.value : "all";
        const selectedAvailability = availabilityFilter ? availabilityFilter.value : "all";

        const filteredShelters = shelters.filter(shelter => {
            const matchesSearch =
                shelter.name.toLowerCase().includes(searchText) ||
                shelter.city.toLowerCase().includes(searchText);

            const matchesFacility =
                selectedFacility === "all" ||
                shelter.facilities.includes(selectedFacility);

            let matchesAvailability = true;

            if (selectedAvailability === "available") {
                matchesAvailability = shelter.available > 0;
            } else if (selectedAvailability === "high") {
                matchesAvailability = shelter.available >= 10;
            }

            return matchesSearch && matchesFacility && matchesAvailability;
        });

        shelterList.innerHTML = "";
        if (resultsCount) resultsCount.textContent = `${filteredShelters.length} shelters found`;
        if (noResults) noResults.hidden = filteredShelters.length !== 0;

        filteredShelters.forEach(shelter => {
            const percentage = (shelter.available / shelter.capacity) * 100;
            const card = document.createElement("article");
            card.className = "directory-card";

            const name = document.createElement("h3");
            name.textContent = shelter.name;

            const location = document.createElement("p");
            location.className = "shelter-location";
            location.textContent = shelter.city;

            const capacityInfo = document.createElement("div");
            capacityInfo.className = "capacity-info";

            const capacityLabel = document.createElement("span");
            capacityLabel.textContent = "Available spaces";

            const capacityValue = document.createElement("strong");
            capacityValue.textContent = `${shelter.available}/${shelter.capacity}`;

            capacityInfo.append(capacityLabel, capacityValue);

            const capacityBar = document.createElement("div");
            capacityBar.className = "capacity-bar";

            const capacityFill = document.createElement("div");
            capacityFill.className = "capacity-fill";
            capacityFill.style.width = `${percentage}%`;

            capacityBar.appendChild(capacityFill);

            const facilityList = document.createElement("div");
            facilityList.className = "facility-list";

            shelter.facilities.forEach(facility => {
                const tag = document.createElement("span");
                tag.className = "facility-tag";
                tag.textContent = facility;
                facilityList.appendChild(tag);
            });

            const status = document.createElement("p");
            status.className = "shelter-status";
            status.textContent = shelter.available > 0
                ? "● Spaces available"
                : "● Currently full";

            // VIEW DETAILS BUTTON
            const detailsButton = document.createElement("button");
            detailsButton.className = "shelter-button";
            detailsButton.textContent = "View Details";
            detailsButton.addEventListener("click", () => {
                viewShelter(shelter.id);
            });

            // REQUEST ALLOCATION BUTTON
            const requestButton = document.createElement("button");
            requestButton.className = "shelter-button";
            requestButton.textContent = shelter.available > 0
                ? "Request Allocation"
                : "Currently Full";

            requestButton.disabled = shelter.available <= 0;
            requestButton.addEventListener("click", () => {
                openAllocationForm(shelter.id);
            });

            card.append(
                name,
                location,
                capacityInfo,
                capacityBar,
                facilityList,
                status,
                detailsButton,
                requestButton
            );

            shelterList.appendChild(card);
        });
    }

    if (searchInput) searchInput.addEventListener("input", displayShelters);
    if (facilityFilter) facilityFilter.addEventListener("change", displayShelters);
    if (availabilityFilter) availabilityFilter.addEventListener("change", displayShelters);

    displayShelters();
}

// ============================================
// 7. SMART SHELTER FINDER
// ============================================

const finderForm = document.getElementById("finder-form");

if (finderForm) {
    finderForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const city = document
            .getElementById("finder-city")
            .value.trim()
            .toLowerCase();

        const people = Number(
            document.getElementById("people-count").value
        );

        const minimumSpaces = Number(
            document.getElementById("minimum-spaces").value
        );

        const requiredFacilities = Array.from(
            document.querySelectorAll(
                'input[name="facility"]:checked'
            )
        ).map(input => input.value);

        const resultsContainer = document.getElementById("finder-results");

        // VALIDATION
        if (
            !city ||
            !Number.isInteger(people) ||
            !Number.isInteger(minimumSpaces) ||
            people < 1 ||
            minimumSpaces < 1
        ) {
            alert("Please enter valid city and capacity details.");
            return;
        }

        // MATCHING ALGORITHM
        const matches = shelters.filter(shelter => {
            const cityMatch = shelter.city.toLowerCase().includes(city);
            const capacityMatch = shelter.available >= people;
            const availabilityMatch = shelter.available >= minimumSpaces;
            const facilityMatch = requiredFacilities.every(facility =>
                shelter.facilities.includes(facility)
            );

            return cityMatch && capacityMatch && availabilityMatch && facilityMatch;
        });

        resultsContainer.innerHTML = "";

        const heading = document.createElement("h3");
        heading.textContent = `${matches.length} suitable shelter(s) found`;
        resultsContainer.appendChild(heading);

        if (matches.length === 0) {
            const message = document.createElement("p");
            message.className = "finder-empty";
            message.textContent = "No shelters match your requirements. Try changing your search criteria.";
            resultsContainer.appendChild(message);
            return;
        }

        matches.forEach(shelter => {
            const card = document.createElement("div");
            card.className = "finder-result-card";

            const name = document.createElement("h4");
            name.textContent = shelter.name;

            const location = document.createElement("p");
            location.textContent = `Location: ${shelter.city}`;

            const spaces = document.createElement("p");
            spaces.textContent = `Available spaces: ${shelter.available}`;

            const facilities = document.createElement("p");
            facilities.textContent = `Facilities: ${shelter.facilities.join(", ")}`;

            const requestButton = document.createElement("button");
            requestButton.className = "shelter-button";
            requestButton.textContent = "Request Allocation";
            requestButton.addEventListener("click", () => {
                openAllocationForm(shelter.id);
            });

            card.append(
                name,
                location,
                spaces,
                facilities,
                requestButton
            );

            resultsContainer.appendChild(card);
        });
    });
}

// ============================================
// 8. SUBMIT ALLOCATION REQUEST (SAFEDATA INTEGRATION)
// ============================================

if (allocationForm) {
    allocationForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const nameInput = document.getElementById("allocation-name");
        const emailInput = document.getElementById("allocation-email");
        const peopleInput = document.getElementById("allocation-people");
        const shelterIdInput = document.getElementById("selected-shelter-id");
        const shelterInfoEl = document.getElementById("allocation-shelter-info");

        const name = nameInput ? nameInput.value.trim() : "";
        const email = emailInput ? emailInput.value.trim() : "";
        const people = peopleInput ? parseInt(peopleInput.value, 10) : 0;
        const shelterId = shelterIdInput && shelterIdInput.value ? Number(shelterIdInput.value) : null;

        // VALIDATION
        if (!name || !email || isNaN(people) || people < 1 || !shelterId) {
            alert("Please select a shelter and enter valid allocation details.");
            return;
        }

        const shelter = shelters.find(item => Number(item.id) === Number(shelterId));
        if (!shelter) {
            alert("Please select a valid shelter.");
            return;
        }

        if (people > shelter.available) {
            alert(`Only ${shelter.available} spaces are currently available.`);
            return;
        }

        const submitBtn = allocationForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Submitting...";
        }

        try {
            // SAVE REQUEST VIA SAFEDATA (SUPABASE / LOCAL STORAGE)
            const response = await SafeData.createRequest({
                shelterId: shelter.id,
                shelterName: shelter.name,
                name: name,
                email: email,
                people: people
            });

            if (allocationMessage) allocationMessage.innerHTML = "";

            if (response.success) {
                const reqId = response.data && response.data.id ? response.data.id.toString().slice(0, 8) : 'REQ';

                const successCard = document.createElement("div");
                successCard.className = "allocation-success";

                const heading = document.createElement("h3");
                heading.textContent = "Request submitted successfully!";

                const details = document.createElement("p");
                details.textContent = `Request ID: ${reqId}... | Shelter: ${shelter.name} | People: ${people} | Status: Pending Review`;

                const disclaimer = document.createElement("p");
                disclaimer.textContent = "Your request is pending administrative review and approval.";

                successCard.append(heading, details, disclaimer);
                if (allocationMessage) allocationMessage.appendChild(successCard);

                allocationForm.reset();
                if (shelterInfoEl) shelterInfoEl.textContent = "Request submitted.";
            } else {
                alert("Error submitting request: " + (response.message || "Unknown error"));
            }
        } catch (err) {
            console.error("Submission error:", err);
            alert("Failed to submit request: " + err.message);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = "Submit Allocation Request →";
            }
        }
    });
}

// ============================================
// 9. USER DASHBOARD LOGIC
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    const tbody = document.getElementById('user-requests-tbody');
    
    // Only run on dashboard page
    if (!tbody) return;

    const requests = await SafeData.getRequests();

    // Stats Elements
    const statTotal = document.getElementById('stat-total');
    const statPending = document.getElementById('stat-pending');
    const statApproved = document.getElementById('stat-approved');
    const statRejected = document.getElementById('stat-rejected');

    // Helper to normalize status strings
    const getNormalizedStatus = (status) => {
        const s = (status || '').toLowerCase();
        return s === 'submitted' ? 'pending' : s;
    };

    if (statTotal) statTotal.textContent = requests.length;
    if (statPending) statPending.textContent = requests.filter(r => getNormalizedStatus(r.status) === 'pending').length;
    if (statApproved) statApproved.textContent = requests.filter(r => getNormalizedStatus(r.status) === 'approved').length;
    if (statRejected) statRejected.textContent = requests.filter(r => ['rejected', 'cancelled'].includes(getNormalizedStatus(r.status))).length;

    if (!requests || requests.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="table-loading">No allocation requests submitted yet.</td></tr>`;
        return;
    }

    tbody.innerHTML = requests.map(req => {
        const shelterName = req.shelters ? req.shelters.name : (req.shelter_name || `Shelter #${req.shelter_id || req.shelterId}`);
        const formattedDate = req.created_at ? new Date(req.created_at).toLocaleDateString() : (req.date || 'N/A');
        const reqId = req.id ? req.id.toString().slice(0, 8) : 'REQ';
        const normalizedStatus = getNormalizedStatus(req.status);

        return `
            <tr>
                <td><strong>${reqId}...</strong></td>
                <td>${shelterName}</td>
                <td>${req.people}</td>
                <td>${formattedDate}</td>
                <td><span class="badge badge-${normalizedStatus}">${normalizedStatus}</span></td>
                <td>
                    ${normalizedStatus === 'pending' ? 
                        `<button class="btn-cancel" onclick="cancelRequest('${req.id}')">Cancel</button>` : 
                        `<span class="action-disabled">None</span>`}
                </td>
            </tr>
        `;
    }).join('');
});

async function cancelRequest(id) {
    if (confirm("Are you sure you want to cancel this pending request?")) {
        const res = await SafeData.updateRequestStatus(id, 'cancelled');
        if (res.success) {
            location.reload();
        } else {
            alert("Failed to cancel request.");
        }
    }
}

// ============================================
// 10. ADMIN DASHBOARD LOGIC
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    const adminReqTbody = document.getElementById('admin-requests-tbody');
    const adminShelterTbody = document.getElementById('admin-shelters-tbody');

    // Only run if on admin page
    if (!adminReqTbody || !adminShelterTbody) return;

    loadAdminDashboard();
});

async function loadAdminDashboard() {
    const adminReqTbody = document.getElementById('admin-requests-tbody');
    const adminShelterTbody = document.getElementById('admin-shelters-tbody');
    
    if (!adminReqTbody || !adminShelterTbody) return;

    const sheltersData = await SafeData.getShelters();
    const requests = await SafeData.getRequests();

    const getNormalizedStatus = (status) => {
        const s = (status || '').toLowerCase();
        return s === 'submitted' ? 'pending' : s;
    };

    // Update Overview Stats
    const totalSheltersEl = document.getElementById('admin-stat-shelters');
    const availSpacesEl = document.getElementById('admin-stat-available');
    const totalReqsEl = document.getElementById('admin-stat-requests');
    const pendingReqsEl = document.getElementById('admin-stat-pending');

    if (totalSheltersEl) totalSheltersEl.textContent = sheltersData.length;
    if (availSpacesEl) availSpacesEl.textContent = sheltersData.reduce((acc, s) => acc + Number(s.available || 0), 0);
    if (totalReqsEl) totalReqsEl.textContent = requests.length;
    if (pendingReqsEl) pendingReqsEl.textContent = requests.filter(r => getNormalizedStatus(r.status) === 'pending').length;

    // Render Requests Table
    if (!requests || requests.length === 0) {
        adminReqTbody.innerHTML = `<tr><td colspan="7" class="table-loading">No allocation requests found.</td></tr>`;
    } else {
        adminReqTbody.innerHTML = requests.map(req => {
            const reqId = req.id ? req.id.toString().slice(0, 8) : 'REQ';
            const normalizedStatus = getNormalizedStatus(req.status);

            return `
                <tr>
                    <td><strong>${reqId}...</strong></td>
                    <td>${req.requester_name || req.name || 'N/A'}</td>
                    <td>${req.requester_email || req.email || 'N/A'}</td>
                    <td>${req.shelter_id || req.shelterId}</td>
                    <td><strong>${req.people}</strong></td>
                    <td><span class="badge badge-${normalizedStatus}">${normalizedStatus}</span></td>
                    <td>
                        ${normalizedStatus === 'pending' ? `
                            <button class="btn-approve" onclick="handleApprove('${req.id}', ${req.shelter_id || req.shelterId}, ${req.people})">Approve</button>
                            <button class="btn-reject" onclick="handleReject('${req.id}')">Reject</button>
                        ` : `<span class="action-disabled">Completed</span>`}
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Render Shelters Table
    adminShelterTbody.innerHTML = sheltersData.map(s => {
        const facilitiesText = Array.isArray(s.facilities) ? s.facilities.join(', ') : s.facilities;
        return `
            <tr>
                <td>#${s.id}</td>
                <td><strong>${s.name}</strong></td>
                <td>${s.city}</td>
                <td>${s.capacity}</td>
                <td><strong style="color: #176b52;">${s.available}</strong></td>
                <td>${facilitiesText}</td>
            </tr>
        `;
    }).join('');
}

async function handleApprove(requestId, shelterId, people) {
    if (confirm("Approve this allocation request and deduct shelter capacity?")) {
        const res = await SafeData.approveRequest(requestId, shelterId, people);
        if (res.success) {
            alert(res.message || "Request approved successfully!");
            loadAdminDashboard();
        } else {
            alert("Approval failed: " + res.message);
        }
    }
}

async function handleReject(requestId) {
    if (confirm("Reject this allocation request?")) {
        const res = await SafeData.updateRequestStatus(requestId, 'rejected');
        if (res.success) {
            loadAdminDashboard();
        } else {
            alert("Failed to reject request.");
        }
    }
}

// ============================================
// 11. AUTO-SELECT SHELTER ON PAGE LOAD & HELPERS
// ============================================

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    let shelterId = urlParams.get("shelterId") || sessionStorage.getItem("selectedShelterId");

    if (shelterId) {
        openAllocationForm(shelterId);
        sessionStorage.removeItem("selectedShelterId");
    }
});

function handleShelterClick(shelterId) {
    openAllocationForm(shelterId);
}
// ============================================
// 12. AUTHENTICATION & NAVBAR SESSION MANAGEMENT
// ============================================

document.addEventListener("DOMContentLoaded", async function () {
    // 1. Update Navigation Bar State
    const currentUser = await SafeData.getCurrentUser();
    updateNavbarAuth(currentUser);

    // 2. Signup Form Handler
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const name = document.getElementById("signup-name").value.trim();
            const email = document.getElementById("signup-email").value.trim();
            const password = document.getElementById("signup-password").value.trim();

            const submitBtn = signupForm.querySelector('button[type="submit"]');
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Creating Account..."; }

            const res = await SafeData.signUp(email, password, name);
            if (res.success) {
                alert("Account created successfully! Redirecting to Dashboard...");
                window.location.href = "dashboard.html";
            } else {
                alert("Sign Up Error: " + res.message);
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Create Account"; }
            }
        });
    }

    // 3. Login Form Handler
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value.trim();

            const submitBtn = loginForm.querySelector('button[type="submit"]');
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Logging in..."; }

            const res = await SafeData.signIn(email, password);
            if (res.success) {
                window.location.href = "dashboard.html";
            } else {
                alert("Login Error: " + res.message);
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Log In"; }
            }
        });
    }
});

function updateNavbarAuth(user) {
    const navLinks = document.querySelectorAll("nav");
    navLinks.forEach(nav => {
        let authLink = nav.querySelector(".auth-nav-link");
        if (!authLink) {
            authLink = document.createElement("a");
            authLink.className = "auth-nav-link";
            nav.appendChild(authLink);
        }

        if (user) {
            authLink.textContent = "Logout (" + (user.user_metadata?.full_name || user.email.split('@')[0]) + ")";
            authLink.href = "#";
            authLink.onclick = async (e) => {
                e.preventDefault();
                await SafeData.signOut();
                window.location.href = "index.html";
            };
        } else {
            authLink.textContent = "Login";
            authLink.href = "login.html";
            authLink.onclick = null;
        }
    });
}