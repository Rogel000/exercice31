import Vehicule from "./classe/vehicule.js";

let startTime = null;
let currentVehicle = null;

document.getElementById("enterBtn").addEventListener("click", handleEnter);
document.getElementById("paymentBtn").addEventListener("click", handlePayment);

function handleEnter() {
  const licencePlate = getLicencePlate();

  if (!licencePlate) {
    showMessage("alertBox", "Veuillez entrer une immatriculation valide.");
    return;
  }

  currentVehicle = new Vehicule(licencePlate);
  startTime = new Date();
  showMessage("successBox", `Ticket obtenu pour ${licencePlate} !`);
  document.getElementById("licencePlate").value = "";
}

function handlePayment() {
  const licencePlate = getLicencePlate();
  if (!licencePlate) {
    showMessage("alertBox", "Veuillez entrer une immatriculation valide.");
    return;
  }

  if (!startTime) {
    showMessage(
      "alertBox",
      `Veuillez d'abord obtenir un ticket pour ${licencePlate}.`
    );
    return;
  }

  const durationInMinutes = calculateDurationInMinutes(startTime, new Date());
  const price = calculatePrice(durationInMinutes);

  showMessage(
    "messageBox",
    `Temps de stationnement: ${durationInMinutes} minutes. Prix à payer: €${price.toFixed(
      2
    )} pour ${licencePlate}`
  );

  reset();
}

function getLicencePlate() {
  return document.getElementById("licencePlate").value.trim();
}

function calculateDurationInMinutes(start, end) {
  return Math.floor((end - start) / 60000);
}

function calculatePrice(durationInMinutes) {
  if (durationInMinutes <= 15) return 0.8;
  if (durationInMinutes <= 30) return 1.3;
  if (durationInMinutes <= 45) return 1.7;
  return 6.0;
}

function reset() {
  startTime = null;
  currentVehicle = null;
  document.getElementById("licencePlate").value = "";
  document.querySelector(".result").innerText = "";
}

function showMessage(boxId, message) {
  const box = document.getElementById(boxId);
  box.style.display = "block";
  box.innerText = message;
  setTimeout(() => {
    box.style.display = "none";
  }, 5000);
}
