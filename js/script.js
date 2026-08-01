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

    let km = prompt("Enter distance in KM");

    if (km == "" || km == null || isNaN(km)) {
        alert("Enter a valid distance.");
        return;
    }

    km = Number(km);

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
        bestCab.service + " is recommended";

    document.getElementById("ride-message").textContent =
        "Estimated Fare : ₹" + bestCab.amount;

    let highest = allCab[0].amount;

    for (let i = 1; i < allCab.length; i++) {

        if (allCab[i].amount > highest) {
            highest = allCab[i].amount;
        }

    }

    document.getElementById("saved-money").textContent =
        "₹" + (highest - bestCab.amount);

    document.getElementById("eco-score").textContent = "A";

    document.getElementById("best-time").textContent =
        bestCab.eta + " min";

};