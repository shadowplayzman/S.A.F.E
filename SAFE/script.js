

const shelters = [
    {
        name: "City Community Hall",
        city: "Ludhiana",
        capacity: 100,
        available: 45,
        facilities: ["Wheelchair Access", "Medical Support"]
    },
    {
        name: "Northside Relief Centre",
        city: "Ludhiana",
        capacity: 80,
        available: 28,
        facilities: ["Food Services", "Family Rooms"]
    },
    {
        name: "Community Relief Shelter",
        city: "Ludhiana",
        capacity: 60,
        available: 16,
        facilities: ["Medical Support", "Wheelchair Access"]
    },
    {
        name: "Green Valley Emergency Centre",
        city: "Jalandhar",
        capacity: 120,
        available: 8,
        facilities: ["Food Services", "Medical Support"]
    },
    {
        name: "Hope Community Shelter",
        city: "Chandigarh",
        capacity: 90,
        available: 0,
        facilities: ["Family Rooms", "Wheelchair Access"]
    },
    {
        name: "Central Relief Facility",
        city: "Amritsar",
        capacity: 150,
        available: 65,
        facilities: ["Food Services", "Medical Support", "Family Rooms"]
    }
];

const shelterList = document.getElementById("shelter-list");

if (shelterList) {
    const searchInput = document.getElementById("shelter-search");
    const facilityFilter = document.getElementById("facility-filter");
    const availabilityFilter = document.getElementById("availability-filter");
    const resultsCount = document.getElementById("results-count");
    const noResults = document.getElementById("no-results");

    function displayShelters() {
        const searchText = searchInput.value.toLowerCase();
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
            } else if (selectedAvailability === "high") {
                matchesAvailability = shelter.available >= 10;
            }

            return matchesSearch && matchesFacility && matchesAvailability;
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

            const facilitiesHTML = shelter.facilities
                .map(facility =>
                    `<span class="facility-tag">${facility}</span>`
                )
                .join("");

            card.innerHTML = `
                <h3>${shelter.name}</h3>
                <p class="shelter-location">${shelter.city}</p>

                <div class="capacity-info">
                    <span>Available spaces</span>
                    <strong>${shelter.available}/${shelter.capacity}</strong>
                </div>

                <div class="capacity-bar">
                    <div class="capacity-fill"
                         style="width: ${percentage}%">
                    </div>
                </div>

                <div class="facility-list">
                    ${facilitiesHTML}
                </div>

                <p class="shelter-status">
                    ${shelter.available > 0
                        ? "● Spaces available"
                        : "● Currently full"}
                </p>
            `;

            shelterList.appendChild(card);
        });
    }

    searchInput.addEventListener("input", displayShelters);
    facilityFilter.addEventListener("change", displayShelters);
    availabilityFilter.addEventListener("change", displayShelters);

    displayShelters();
}


// SMART SHELTER FINDER

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

        // Find shelters matching all requirements
        const matches = shelters.filter(shelter => {

            const cityMatch =
                shelter.city.toLowerCase() === city;

            const capacityMatch =
                shelter.available >= people &&
                shelter.available >= minimumSpaces;

            const facilityMatch =
                requiredFacilities.every(facility =>
                    shelter.facilities.includes(facility)
                );

            return cityMatch && capacityMatch && facilityMatch;
        });

        // Display results
        resultsContainer.innerHTML = "";

        const heading = document.createElement("h3");
        heading.textContent =
            `${matches.length} suitable shelter(s) found`;

        resultsContainer.appendChild(heading);

        if (matches.length === 0) {
            const message = document.createElement("p");
            message.className = "finder-empty";
            message.textContent =
                "No shelters match all your requirements. Try changing your search criteria.";

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

            card.append(name, location, spaces, facilities);
            resultsContainer.appendChild(card);
        });
    });
}
