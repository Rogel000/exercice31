import Vehicule from "./classe/vehicule.js";

let startTime = null;
let currentVehicle = null;

const PRICING = {
  FIRST_15_MINUTES: 0.8,
  UP_TO_30_MINUTES: 1.3,
  UP_TO_45_MINUTES: 1.7,
  ABOVE_45_MINUTES: 6.0
};

document.getElementById("enterBtn").addEventListener("click", handleEnter);
document.getElementById("paymentBtn").addEventListener("click", handlePayment);

function handleEnter() {
  const licencePlate = getLicencePlate();
  if (!isLicencePlateValid(licencePlate)) return;

  currentVehicle = new Vehicule(licencePlate);
  startTime = new Date();
  saveToLocalStorage("currentVehicle", currentVehicle);
  saveToLocalStorage("startTime", startTime.toISOString());

  showMessage("successBox", `Ticket obtenu pour ${licencePlate} !`);
  resetInputField("licencePlate");
}

function handlePayment() {
  const licencePlate = getLicencePlate();
  if (!isLicencePlateValid(licencePlate)) return;

  const storedStartTime = loadFromLocalStorage("startTime");
  if (!storedStartTime) {
    showMessage("alertBox", `Veuillez d'abord obtenir un ticket pour ${licencePlate}.`);
    return;
  }

  const durationInMinutes = calculateDurationInMinutes(new Date(storedStartTime), new Date());
  const price = calculatePrice(durationInMinutes);

  showMessage(
    "messageBox",
    `Temps de stationnement: ${durationInMinutes} minutes. Prix à payer: €${price.toFixed(2)} pour ${licencePlate}`
  );
  
  clearStorage();
  reset();
}

function isLicencePlateValid(licencePlate) {
  if (!licencePlate) {
    showMessage("alertBox", "Veuillez entrer une immatriculation valide.");
    return false;
  }
  return true;
}

function calculateDurationInMinutes(start, end) {
  return Math.floor((end - start) / 60000);
}

function calculatePrice(durationInMinutes) {
  if (durationInMinutes <= 15) return PRICING.FIRST_15_MINUTES;
  if (durationInMinutes <= 30) return PRICING.UP_TO_30_MINUTES;
  if (durationInMinutes <= 45) return PRICING.UP_TO_45_MINUTES;
  return PRICING.ABOVE_45_MINUTES;
}

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadFromLocalStorage(key) {
  return localStorage.getItem(key);
}

function clearStorage() {
  localStorage.removeItem("startTime");
  localStorage.removeItem("currentVehicle");
}

function reset() {
  startTime = null;
  currentVehicle = null;
  resetInputField("licencePlate");
  clearMessageBox("result");
}

function resetInputField(fieldId) {
  document.getElementById(fieldId).value = "";
}

function clearMessageBox(boxId) {
  document.querySelector(`.${boxId}`).innerText = "";
}

function showMessage(boxId, message) {
  const box = document.getElementById(boxId);
  box.style.display = "block";
  box.innerText = message;
  setTimeout(() => {
    box.style.display = "none";
  }, 5000);
}

function getLicencePlate() {
  return document.getElementById("licencePlate").value.trim();
}
