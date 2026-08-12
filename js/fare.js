function ridePrice(km, ride) {
    return Math.round(ride.fare + km * ride.perKm);
}

function getAvailableRides(km, rideType) {
    const available = [];

    for (let ride of cabServices) {
        if (ride.rides.includes(rideType)) {
            available.push({
                service: ride.name,
                amount: ridePrice(km, ride),
                eta: ride.eta,
                stars: ride.stars
            });
        }
    }

    return available;
}

function chooseRide(km, rideType) {
    const available = getAvailableRides(km, rideType);
    let selectedCab = null;

    for (let ride of available) {
        if (!selectedCab || ride.amount < selectedCab.amount) {
            selectedCab = ride;
        }
    }

    return selectedCab;
}

function compareRide(km, rideType) {
    return getAvailableRides(km, rideType);
}