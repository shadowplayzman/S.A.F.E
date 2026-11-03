
// ==========================================
// S.A.F.E. - SHELTER DATA
// ==========================================

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


// ==========================================
// SHELTER DIRECTORY
// ==========================================

const shelterList = document.getElementById("shelter-list");

if (shelterList) {

    const searchInput = document.getElementById("shelter-search");
    const facilityFilter = document.getElementById("facility-filter");
    const availabilityFilter = document.getElementById("availability-filter");
    const resultsCount = document.getElementById("results-count");
    const noResults = document.getElementById("no-results");

    function displayShelters() {

        const searchText = searchInput.value.trim().toLowerCase();
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

        noResults.hidden = filteredShelters.length !== 0;

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

            const detailsButton = document.createElement("button");
            detailsButton.className = "shelter-button";
            detailsButton.textContent = "View Details";

            detailsButton.addEventListener("click", () => {
                viewShelter(shelter.id);
            });

            card.append(
                name,
                location,
                capacityInfo,
                capacityBar,
                facilityList,
                status,
                detailsButton
            );

            shelterList.appendChild(card);
        });
    }

    searchInput.addEventListener("input", displayShelters);
    facilityFilter.addEventListener("change", displayShelters);
    availabilityFilter.addEventListener("change", displayShelters);

    displayShelters();
}


// ==========================================
// SHELTER DETAILS
// ==========================================

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


// ==========================================
// SMART SHELTER FINDER
// ==========================================

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

        // Validate inputs

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

        // Match shelters

        const matches = shelters.filter(shelter => {

            const cityMatch =
                shelter.city.toLowerCase() === city;

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

        // Clear previous results

        resultsContainer.innerHTML = "";

        const heading = document.createElement("h3");

        heading.textContent =
            `${matches.length} suitable shelter(s) found`;

        resultsContainer.appendChild(heading);

        // No matching shelters

        if (matches.length === 0) {

            const message = document.createElement("p");

            message.className = "finder-empty";

            message.textContent =
                "No shelters match your requirements. Try changing your search criteria.";

            resultsContainer.appendChild(message);

            return;
        }

        // Display matching shelters

        matches.forEach(shelter => {

            const card = document.createElement("div");
            card.className = "finder-result-card";

            const name = document.createElement("h4");
            name.textContent = shelter.name;

            const location = document.createElement("p");
            location.textContent =
                `Location: ${shelter.city}`;

            const spaces = document.createElement("p");
            spaces.textContent =
                `Available spaces: ${shelter.available}`;

            const facilities = document.createElement("p");
            facilities.textContent =
                `Facilities: ${shelter.facilities.join(", ")}`;

            const detailsButton = document.createElement("button");
            detailsButton.className = "shelter-button";
            detailsButton.textContent = "View Details";

            detailsButton.addEventListener("click", () => {
                viewShelter(shelter.id);
            });

            card.append(
                name,
                location,
                spaces,
                facilities,
                detailsButton
            );

            resultsContainer.appendChild(card);
        });

    });
}
