import Vehicule from './classe/vehicule.js';

let startTime = null;
let currentVehicle = null;

document.getElementById('enterBtn').addEventListener('click', function() {
    const licencePlate = document.getElementById('licencePlate').value;

    if (licencePlate === "") {
        showMessage("alertBox", "Veuillez entrer une immatriculation valide.");
        return;
    }
    
    currentVehicle = new Vehicule(licencePlate); 
    startTime = new Date(); 
    showMessage("successBox", `Ticket obtenu pour ${licencePlate} !`);
   
});

document.getElementById('paymentBtn').addEventListener('click', function() {
    const licencePlate = document.getElementById('licencePlate').value;
    if (!startTime) {
        showMessage("alertBox", `Veuillez d'abord obtenir un ticket pour ${licencePlate} `);
        return;
    }

    const endTime = new Date();
    const durationInMinutes = Math.floor((endTime - startTime) / 60000); 
    let price; 

    if (durationInMinutes <= 15) {
        price = 0.80;
    } else if (durationInMinutes <= 30) {
        price = 1.30;
    } else if (durationInMinutes <= 45) {
        price = 1.70;
    } else {
        price = 6.00;
    }

    showMessage("messageBox", `Temps de stationnement: ${durationInMinutes} minutes. Prix à payer: €${price.toFixed(2)} pour ${licencePlate}`);

    // Reset
    startTime = null;
    currentVehicle = null;
    document.querySelector('.result').innerText = ''; 
});

function showMessage(boxId, message) {
    const box = document.getElementById(boxId);
    box.style.display = 'block';
    box.innerText = message;
    setTimeout(() => {
        box.style.display = 'none';
    }, 5000);
}
