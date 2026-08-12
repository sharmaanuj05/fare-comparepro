const compareBtn = document.getElementById("compare-btn");
const rideType = document.getElementById("vehicle-type");
const seatText = document.getElementById("max-passengers");
const distanceInput = document.getElementById("distance");
const departureInput = document.getElementById("departure-time");

const seatCount = {
    Bike: 1,
    Auto: 3,
    Sedan: 4,
    "Compact SUV": 4,
    SUV: 5
};

rideType.onchange = function () {
    seatText.textContent = "👥 Max Passengers : " + seatCount[this.value];
};

function updateRideCards(rides) {
    const cards = document.querySelectorAll(".ride-card");

    for (let card of cards) {
        const service = card.dataset.service;
        const ride = rides.find(function (item) {
            return item.service === service;
        });

        card.style.display = ride ? "" : "none";

        if (ride) {
            document.getElementById(service.toLowerCase() + "-fare").textContent =
                "₹" + ride.amount;

            document.getElementById(service.toLowerCase() + "-time").textContent =
                ride.eta + " min";

            document.getElementById(service.toLowerCase() + "-rating").textContent =
                ride.stars;
        }
    }
}

function getAdjustedEta(eta, time) {
    const hour = parseInt(time.split(":")[0]);

    if (hour >= 8 && hour <= 10) {
        return eta + 2;
    }

    if (hour >= 17 && hour <= 20) {
        return eta + 3;
    }

    return eta;
}

function animateValues() {
    const values = document.querySelectorAll(
        "#saving-value, #eta-value, #saved-money, #eco-score, #best-time"
    );

    for (let value of values) {
        value.classList.remove("updated");

        setTimeout(function () {
            value.classList.add("updated");
        }, 50);
    }
}

compareBtn.onclick = function () {
    const pickup = document.getElementById("pickup").value.trim();
    const drop = document.getElementById("drop").value.trim();
    const departureTime = departureInput.value;
    const distance = Number(distanceInput.value);
    const selectedType = rideType.value;

    if (!pickup || !drop) {
        alert("Please enter both pickup and destination.");
        return;
    }

    if (!departureTime) {
        alert("Please select a departure time.");
        return;
    }

    if (!distance || distance <= 0) {
        alert("Please enter a valid distance.");
        return;
    }

    compareBtn.textContent = "Comparing...";
    compareBtn.disabled = true;

    const allRides = compareRide(distance, selectedType);
    const bestRide = chooseRide(distance, selectedType);

    if (!bestRide) {
        alert("No ride service is available for the selected ride type.");
        compareBtn.textContent = "Find Best Ride";
        compareBtn.disabled = false;
        return;
    }

    updateRideCards(allRides);

    rideCards.forEach(function (card) {
        card.classList.remove("selected", "flipped");
    });

    const adjustedEta = getAdjustedEta(bestRide.eta, departureTime);

    let highestFare = 0;

    for (let ride of allRides) {
        if (ride.amount > highestFare) {
            highestFare = ride.amount;
        }
    }

    const saving = highestFare - bestRide.amount;

    document.getElementById("ride-title").textContent = bestRide.service;
    document.getElementById("ride-message").textContent =
        "Estimated Fare • ₹" + bestRide.amount;
    document.getElementById("saving-value").textContent = "₹" + saving;
    document.getElementById("eta-value").textContent = adjustedEta + " min";
    document.getElementById("saved-money").textContent = "₹" + saving;

    document.getElementById("trip-status").textContent =
        adjustedEta <= 6
            ? "Quick pickup available"
            : "Better fare available";

    document.getElementById("eco-score").textContent = "A";
    document.getElementById("best-time").textContent = adjustedEta + " min";

    animateValues();

    addTrip(
        bestRide.service +
        " • " +
        selectedType +
        " • " +
        distance +
        " km • ₹" +
        bestRide.amount
    );

    const resultPanel = document.querySelector(".result-panel");

    resultPanel.classList.remove("show");

    setTimeout(function () {
        resultPanel.classList.add("show");
    }, 50);

    compareBtn.textContent = "Find Best Ride";
    compareBtn.disabled = false;
};

let recentTrips =
    JSON.parse(localStorage.getItem("recentTrips")) || [];

function updateTrips() {
    const tripBox = document.getElementById("search-list");

    tripBox.innerHTML = "";

    if (recentTrips.length === 0) {
        tripBox.innerHTML = "<li>No recent searches.</li>";
        return;
    }

    for (let trip of recentTrips) {
        const row = document.createElement("li");
        row.textContent = trip;
        tripBox.appendChild(row);
    }
}

function addTrip(value) {
    recentTrips.unshift(value);

    if (recentTrips.length > 5) {
        recentTrips.length = 5;
    }

    localStorage.setItem("recentTrips", JSON.stringify(recentTrips));
    updateTrips();
}

updateTrips();

document.getElementById("clear-history").onclick = function () {
    recentTrips = [];
    localStorage.removeItem("recentTrips");
    updateTrips();
};

const modeBtn = document.getElementById("theme-toggle");

let savedMode = localStorage.getItem("pageMode");

if (!savedMode) {
    savedMode = "night";
    localStorage.setItem("pageMode", "night");
}

if (savedMode === "night") {
    document.body.classList.add("night");
    modeBtn.textContent = "☀️";
}

modeBtn.onclick = function () {
    document.body.classList.toggle("night");

    const darkOn = document.body.classList.contains("night");

    localStorage.setItem("pageMode", darkOn ? "night" : "day");
    modeBtn.textContent = darkOn ? "☀️" : "🌙";
};

document.addEventListener("keydown", function (event) {
    if (
        event.key === "Enter" &&
        document.activeElement.tagName !== "BUTTON"
    ) {
        compareBtn.click();
    }
});

const rideCards = document.querySelectorAll(".ride-card");

for (let card of rideCards) {
    const selectButton = card.querySelector(".select-ride");

    card.addEventListener("click", function (event) {
        if (
            window.matchMedia("(hover: none)").matches &&
            !event.target.closest(".select-ride")
        ) {
            card.classList.toggle("flipped");
        }
    });

    selectButton.onclick = function (event) {
        event.stopPropagation();

        rideCards.forEach(function (item) {
            item.classList.remove("selected");
        });

        card.classList.add("selected");

        const service = card.dataset.service;

        const selectedRide = cabServices.find(function (ride) {
            return ride.name === service;
        });

        const distance = Number(distanceInput.value) || 10;
        const amount = ridePrice(distance, selectedRide);
        const departureTime = departureInput.value;

        const eta = departureTime
            ? getAdjustedEta(selectedRide.eta, departureTime)
            : selectedRide.eta;

        document.getElementById("ride-title").textContent = service;
        document.getElementById("ride-message").textContent =
            "Selected Fare • ₹" + amount;
        document.getElementById("eta-value").textContent = eta + " min";
        document.getElementById("trip-status").textContent =
            "Ride selected successfully.";
    };
}

const animatedSections = document.querySelectorAll(
    "#ride-search, #ride-results, #ride-insights, #ride-history, #footer"
);

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("section-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    animatedSections.forEach(function (section) {
        section.classList.add("section-hidden");
        revealObserver.observe(section);
    });
}