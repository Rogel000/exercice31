import Vehicule from "./classe/vehicule.js";

let currentVehicle = null;
let vehicules = JSON.parse(localStorage.getItem("vehicules")) || [];

document.getElementById("enterBtn").addEventListener("click", handleEnter);
document.getElementById("paymentBtn").addEventListener("click", handlePayment);
document.getElementById("searchBtn").addEventListener("click", handleSearch);
// document.getElementById("dateRangeBtn").addEventListener("click", handleDateRange);

function handleEnter() {
  const licencePlate = getLicencePlate("enter");
  if (!licencePlate) {
    showMessage("alertBox", "Veuillez entrer une immatriculation valide.");
    return;
  }
  const existingVehicle = vehicules.find(
    (v) => v.licencePlate === licencePlate && v.endTime === null
  );
  if (existingVehicle) {
    showMessage(
      "alertBox",
      `Le véhicule avec la plaque ${licencePlate} est déjà enregistré.`
    );
    return;
  }

  currentVehicle = new Vehicule(licencePlate);
  const startTime = new Date();
  vehicules.push({ licencePlate: licencePlate, startTime: startTime });
  localStorage.setItem("vehicules", JSON.stringify(vehicules));

  showMessage("successBox", `Ticket obtenu pour ${licencePlate} !`);
  document.getElementById("licencePlate").value = "";
}

function handlePayment() {
  const licencePlate = getLicencePlate("payment");
  if (!licencePlate) {
    showMessage("alertBox", "Veuillez entrer une immatriculation valide.");
    return;
  }

  const vehiculeRecord = vehicules.find(
    (v) => v.licencePlate === licencePlate && v.endTime === undefined
  );

  if (!vehiculeRecord) {
    showMessage(
      "alertBox",
      `Veuillez d'abord obtenir un ticket pour ${licencePlate}.`
    );
    return;
  }

  const endTime = new Date();
  const startTime = new Date(vehiculeRecord.startTime);
  const durationInMinutes = calculateDurationInMinutes(startTime, endTime);
  const price = calculatePrice(durationInMinutes);

  vehiculeRecord.endTime = endTime;
  localStorage.setItem("vehicules", JSON.stringify(vehicules));

  showMessage(
    "messageBox",
    `Temps de stationnement: ${durationInMinutes} minutes. Prix à payer: €${price.toFixed(
      2
    )} pour ${licencePlate}`
  );

  reset();
}

function getLicencePlate(action) {
  let plate;
  if (action === "enter" || action === "payment") {
    plate = document.getElementById("licencePlate").value.trim();
  } else if (action === "search") {
    plate = document.getElementById("searchPlate").value.trim();
  }
  console.log("Plate value from input:", plate);
  return plate.length > 0 ? plate : null;
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

function handleSearch() {
  const licencePlate = getLicencePlate("search");
  console.log("Licence Plate for search:", licencePlate);
  if (!licencePlate) {
    showMessage("alertBox", "Veuillez entrer une immatriculation valide.");
    return;
  }

  const history = vehicules.filter((v) => v.licencePlate === licencePlate);
  displayHistory(history, `Historique pour ${licencePlate}:`);
}

function displayHistory(history, message) {
  const resultBox = document.querySelector(".result");

  const table = document.createElement("table");
  table.classList.add("table", "table-striped");

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headerRow.innerHTML = `
        <th>Plaque</th>
        <th>Entrée</th>
        <th>Sortie</th>
    `;
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  if (history.length === 0) {
    const noDataRow = document.createElement("tr");
    noDataRow.innerHTML = `<td colspan="3">Aucun enregistrement trouvé.</td>`;
    tbody.appendChild(noDataRow);
  } else {
    history.forEach((v) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${v.licencePlate}</td>
                <td>${new Date(v.startTime).toLocaleString()}</td>
                <td>${
                  v.endTime ? new Date(v.endTime).toLocaleString() : "N/A"
                }</td>
            `;
      tbody.appendChild(row);
    });
  }
  table.appendChild(tbody);

  resultBox.innerHTML = `<h4>${message}</h4>`;
  resultBox.appendChild(table);
}
