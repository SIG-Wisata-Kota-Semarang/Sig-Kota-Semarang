let locations = [];
let currentPage = 1;
const itemsPerPage = 5;

async function fetchLocations() {
	const response = await fetch("assets/js/mockdb.json");
	locations = await response.json();
	populateTable();
	setupPagination();
}

function populateTable() {
	const tableBody = document.getElementById("table-body");
	tableBody.innerHTML = ""; // Clear previous entries
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedLocations = locations.slice(startIndex, endIndex);

	paginatedLocations.forEach((location) => {
		const row = document.createElement("tr");
		row.innerHTML = `
              <td class="text-center">${location.id}</td>
              <td>${location.name}</td>
              <td>${location.category}</td>
              <td>${location.address}</td>
              <td>${location.price}</td>
              <td>
                  <button type="button" class="btn btn-primary" onclick="showDetails(${location.id})">Details</button>
              </td>
          `;
		tableBody.appendChild(row);
	});
}

function setupPagination() {
	const pagination = document.getElementById("pagination");
	pagination.innerHTML = ""; // Clear previous pagination
	const totalPages = Math.ceil(locations.length / itemsPerPage);

	// Previous Button
	const prevButton = document.createElement("button");
	prevButton.innerText = "Previous";
	prevButton.className = "btn btn-primary mx-1";
	prevButton.disabled = currentPage === 1; // Disable if on the first page
	prevButton.onclick = () => {
		if (currentPage > 1) {
			currentPage--;
			populateTable();
			setupPagination();
		}
	};
	pagination.appendChild(prevButton);

	// Page Number Buttons
	for (let i = 1; i <= totalPages; i++) {
		const pageButton = document.createElement("button");
		pageButton.innerText = i;
		pageButton.className = `btn mx-1 ${
			i === currentPage ? "btn-success" : "btn-primary"
		}`;
		pageButton.onclick = () => {
			currentPage = i;
			populateTable();
			setupPagination();
		};
		pagination.appendChild(pageButton);
	}

	// Next Button
	const nextButton = document.createElement("button");
	nextButton.innerText = "Next";
	nextButton.className = "btn btn-primary mx-1";
	nextButton.disabled = currentPage === totalPages; // Disable if on the last page
	nextButton.onclick = () => {
		if (currentPage < totalPages) {
			currentPage++;
			populateTable();
			setupPagination();
		}
	};
	pagination.appendChild(nextButton);
}

function showDetails(id) {
	const location = locations.find((loc) => loc.id === id);
	const detailsContent = document.getElementById("details-content");
	if (!location) {
		detailsContent.innerHTML = `<p class="text-danger">Location details not found!</p>`;
		return;
	}

	const thumbnail = location.images[0];
	const dataImages = location.images
		.slice(1)
		.map((image) => `<img id="data-images" src="${image}" alt="alt" />`)
		.join("");
	detailsContent.innerHTML = `
      <div class="row align-items-center border rounded p-5">
        <div class="col-md-6">
            <h2><strong>${location.name}</strong></h2>
            <p class="p-1 text-primary bg-success rounded d-inline"><strong>${location.category}</strong></p>
            <p class="mt-2">${location.description}</p>
        </div>
        <div class="col-md-6 d-flex flex-column">
          <div class="ms-auto">
            <button class="btn btn-danger mb-3" onclick="hideDetails()">Close</button>
          </div>
          <p>Address: ${location.address}</p>
          <p>Price: ${location.price}</p>
          <p>Jam Buka: ${location.openHours}</p>
        </div>
        <div class="d-flex justify-content-center mt-4">
            <img id="data-thumbnail" src="${thumbnail}" alt="${location.name}" class="img-fluid" />
        </div>
        <div class="d-flex flex-wrap justify-content-center mt-4">
          ${dataImages}
        </div>
      </div
      `;

	document.getElementById("details").style.display = "block";
}

function hideDetails() {
	document.getElementById("details").style.display = "none";
}

fetchLocations();
