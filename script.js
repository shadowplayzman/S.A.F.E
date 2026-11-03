
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

    const saved = JSON.parse(
        localStorage.getItem("safeShelterAvailability") || "{}"
    );

    shelters.forEach(shelter => {

        if (saved[shelter.id] !== undefined) {
            shelter.available = saved[shelter.id];
        }

    });

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
        item => item.id === shelterId
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

const allocationSection =
    document.getElementById("allocation-section");

const allocationForm =
    document.getElementById("allocation-form");

const allocationMessage =
    document.getElementById("allocation-message");


// ============================================
// 5. OPEN ALLOCATION FORM
// ============================================

function openAllocationForm(shelterId) {

    const shelter = shelters.find(
        item => item.id === shelterId
    );

    if (!shelter) return;

    if (!allocationSection || !allocationForm) {

        alert(
            "The allocation form is not available on this page."
        );

        return;

    }

    if (shelter.available <= 0) {

        alert("This shelter currently has no available spaces.");

        return;

    }

    document.getElementById("selected-shelter-id").value =
        shelter.id;

    document.getElementById("allocation-shelter-info").textContent =
        `${shelter.name} | ${shelter.available} spaces available`;

    document.getElementById("allocation-people").value = 1;

    allocationMessage.innerHTML = "";

    allocationSection.hidden = false;

    allocationSection.scrollIntoView({
        behavior: "smooth"
    });

}


// ============================================
// 6. SHELTER DIRECTORY
// ============================================

const shelterList = document.getElementById("shelter-list");

if (shelterList) {

    const searchInput =
        document.getElementById("shelter-search");

    const facilityFilter =
        document.getElementById("facility-filter");

    const availabilityFilter =
        document.getElementById("availability-filter");

    const resultsCount =
        document.getElementById("results-count");

    const noResults =
        document.getElementById("no-results");


    function displayShelters() {

        const searchText =
            searchInput.value.trim().toLowerCase();

        const selectedFacility = facilityFilter.value;

        const selectedAvailability = availabilityFilter.value;


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
            }

            else if (selectedAvailability === "high") {
                matchesAvailability = shelter.available >= 10;
            }

            return matchesSearch &&
                   matchesFacility &&
                   matchesAvailability;

        });


        shelterList.innerHTML = "";

        resultsCount.textContent =
            `${filteredShelters.length} shelters found`;

        noResults.hidden =
            filteredShelters.length !== 0;


        filteredShelters.forEach(shelter => {

            const percentage =
                (shelter.available / shelter.capacity) * 100;


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

            capacityValue.textContent =
                `${shelter.available}/${shelter.capacity}`;


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


    searchInput.addEventListener("input", displayShelters);

    facilityFilter.addEventListener("change", displayShelters);

    availabilityFilter.addEventListener("change", displayShelters);


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


        const resultsContainer =
            document.getElementById("finder-results");


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

            const cityMatch =
                shelter.city.toLowerCase().includes(city);

            const capacityMatch =
                shelter.available >= people;

            const availabilityMatch =
                shelter.available >= minimumSpaces;

            const facilityMatch =
                requiredFacilities.every(facility =>
                    shelter.facilities.includes(facility)
                );


            return cityMatch &&
                   capacityMatch &&
                   availabilityMatch &&
                   facilityMatch;

        });


        resultsContainer.innerHTML = "";


        const heading = document.createElement("h3");

        heading.textContent =
            `${matches.length} suitable shelter(s) found`;

        resultsContainer.appendChild(heading);


        if (matches.length === 0) {

            const message = document.createElement("p");

            message.className = "finder-empty";

            message.textContent =
                "No shelters match your requirements. Try changing your search criteria.";

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

            spaces.textContent =
                `Available spaces: ${shelter.available}`;


            const facilities = document.createElement("p");

            facilities.textContent =
                `Facilities: ${shelter.facilities.join(", ")}`;


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
// 8. SUBMIT ALLOCATION REQUEST
// ============================================

if (allocationForm) {

    allocationForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const name = document
            .getElementById("allocation-name")
            .value.trim();


        const email = document
            .getElementById("allocation-email")
            .value.trim();


        const people = Number(
            document.getElementById("allocation-people").value
        );


        const shelterId = Number(
            document.getElementById("selected-shelter-id").value
        );


        const shelter = shelters.find(
            item => item.id === shelterId
        );


        // VALIDATION

        if (
            !name ||
            !email ||
            !Number.isInteger(people) ||
            people < 1
        ) {

            alert("Please enter valid allocation details.");

            return;

        }


        if (!shelter) {

            alert("Please select a valid shelter.");

            return;

        }


        // CHECK CAPACITY

        if (people > shelter.available) {

            alert(
                `Only ${shelter.available} spaces are currently available.`
            );

            return;

        }


        // GENERATE UNIQUE REQUEST ID

        const requestId =
            "SAFE-" + Date.now().toString().slice(-8);


        // CREATE REQUEST

        const request = {

            id: requestId,

            name: name,

            email: email,

            people: people,

            shelterId: shelter.id,

            shelterName: shelter.name,

            city: shelter.city,

            status: "Submitted",

            date: new Date().toLocaleString()

        };


        // SAVE REQUEST

        const existingRequests = getRequests();

        existingRequests.push(request);

        localStorage.setItem(
            "safeAllocationRequests",
            JSON.stringify(existingRequests)
        );


        // UPDATE AVAILABILITY

        shelter.available -= people;

        saveAvailability();


        // CONFIRMATION MESSAGE

        allocationMessage.innerHTML = "";


        const successCard = document.createElement("div");

        successCard.className = "allocation-success";


        const heading = document.createElement("h3");

        heading.textContent =
            "Request submitted successfully!";


        const details = document.createElement("p");

        details.textContent =
            `Request ID: ${requestId} | ` +
            `Shelter: ${shelter.name} | ` +
            `People: ${people} | ` +
            `Status: Submitted`;


        const disclaimer = document.createElement("p");

        disclaimer.textContent =
            "This is a demonstration request, not a confirmed shelter reservation.";


        successCard.append(
            heading,
            details,
            disclaimer
        );

        allocationMessage.appendChild(successCard);


        allocationForm.reset();


        document.getElementById("allocation-shelter-info")
            .textContent = "Request submitted.";


        // REFRESH DIRECTORY IF PRESENT

        if (shelterList) {

            if (typeof displayShelters === "function") {
                displayShelters();
            }

            else {
                location.reload();
            }

        }


        // REFRESH FINDER RESULTS IF PRESENT

        if (finderForm) {

            finderForm.dispatchEvent(
                new Event("submit", { cancelable: true })
            );

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
        const shelterName = req.shelters ? req.shelters.name : (req.shelter_name || `Shelter #${req.shelter_id}`);
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