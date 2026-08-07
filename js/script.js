const compareBtn = document.getElementById("compare-btn");
const rideType = document.getElementById("vehicle-type");
const seatText = document.getElementById("max-passengers");

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
compareBtn.onclick = function () {

    let km = 10;

    let allCab = compareRide(km);

    let bestCab = chooseRide(km);

    for (let i = 0; i < allCab.length; i++) {

        let company = allCab[i].service.toLowerCase();

        document.getElementById(company + "-fare").textContent =
            "₹" + allCab[i].amount;

        document.getElementById(company + "-time").textContent =
            allCab[i].eta + " min";

        document.getElementById(company + "-rating").textContent =
            allCab[i].stars;

    }

    document.getElementById("ride-title").textContent =
        bestCab.service;

    document.getElementById("ride-message").textContent =
        "Estimated Fare • ₹" + bestCab.amount;

    let highestFare = allCab[0].amount;

    for (let i = 1; i < allCab.length; i++) 
{

     if (allCab[i].amount > highestFare) 
    {
        highestFare = allCab[i].amount;
    }

}
document.getElementById("saving-value").textContent =
    "₹" + (highestFare - bestCab.amount);

    document.getElementById("eta-value").textContent =
        bestCab.eta + " min";

    document.getElementById("saved-money").textContent =
    "₹" + (highestFare - bestCab.amount);

    document.getElementById("trip-status").textContent =
        bestCab.eta <= 6 ? "Quick pickup available" : "Better fare available";

    document.getElementById("eco-score").textContent = "A";

    document.getElementById("best-time").textContent =
        bestCab.eta + " min";

    addTrip(bestCab.service + " • ₹" + bestCab.amount);

};
let recentTrips = JSON.parse(localStorage.getItem("recentTrips")) || [];
function updateTrips() {

    let tripBox = document.getElementById("search-list");

    tripBox.innerHTML = "";

    if (recentTrips.length == 0) {

        tripBox.innerHTML = "<li>No recent searches.</li>";
        return;

    }

    for (let trip of recentTrips) {

        let row = document.createElement("li");

        row.innerText = trip;

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
const modeBtn = document.getElementById("theme-toggle");

let savedMode = localStorage.getItem("pageMode");

if (savedMode == "night") {

    document.body.classList.add("night");
    modeBtn.textContent = "☀️";

}

modeBtn.onclick = function () {

    document.body.classList.toggle("night");

    let darkOn = document.body.classList.contains("night");

    if (darkOn) {

        localStorage.setItem("pageMode", "night");
        modeBtn.textContent = "☀️";

    } else {

        localStorage.setItem("pageMode", "day");
        modeBtn.textContent = "🌙";

    }

};