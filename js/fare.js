function ridePrice(km, ride) {
    return ride.fare + km * ride.perKm;
}

function chooseRide(km) {
    let selectedCab;

    for (let i = 0; i < cabServices.length; i++) {
        let amount = ridePrice(km, cabServices[i]);

        if (!selectedCab || amount < selectedCab.amount) {
            selectedCab = {
                service: cabServices[i].name,
                amount: amount,
                eta: cabServices[i].eta,
                stars: cabServices[i].stars
            };
        }
    }

    return selectedCab;
}

function compareRide(km) {
    let details = [];

    for (let i = 0; i < cabServices.length; i++) {
        details.push({
            service: cabServices[i].name,
            amount: ridePrice(km, cabServices[i]),
            eta: cabServices[i].eta,
            stars: cabServices[i].stars
        });
    }

    return details;
}