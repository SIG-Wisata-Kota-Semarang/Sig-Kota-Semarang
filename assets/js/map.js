// Inisialisasi Map Utama
const mainMap = L.map('main-map').setView([-6.9826, 110.4145], 12);

// Function to switch tile layer based on theme
function setTileLayerBasedOnTheme() {
    const body = document.querySelector('body');
    const lightTileLayer = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const darkTileLayer = 'https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=Eo9BvULUjezyFW9aZKn9';

    // Remove the existing tile layer
    mainMap.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
            mainMap.removeLayer(layer);
        }
    });

    // Add the correct tile layer based on the current theme
    if (body.classList.contains('dark-mode')) {
        L.tileLayer(darkTileLayer).addTo(mainMap);
    } else {
        L.tileLayer(lightTileLayer).addTo(mainMap);
    }
}

// Initial tile layer setting based on theme
setTileLayerBasedOnTheme();

// Update tile layer when the theme changes
document.getElementById('theme-toggle').addEventListener('change', setTileLayerBasedOnTheme);

// Objek untuk menyimpan marker berdasarkan ID atau nama
const markerMap = {};
let userMarker;
let routingControl; // Store routing control

// Fungsi Menambahkan Marker dari JSON
function addMarkersFromJSON(data) {
    data.forEach(location => {
        // Tambahkan marker
        const marker = L.marker(location.coords).addTo(mainMap);
        
        // Define the route button functionality
        const routeButton = `<button onclick="getRouteTo(${location.coords[0]}, ${location.coords[1]})">Get Route</button>`;

        marker.bindPopup(`
            <div style="line-height: 1.2; font-size: 14px; margin: 5px;">
                <b>${location.name}</b><br>
                ${location.shortdescription}<br>
                <strong>Alamat:</strong> ${location.address}<br>
                <strong>Harga Tiket:</strong> ${location.price}<br>
                <strong>Jam Buka:</strong> ${location.hours}<br>
                ${routeButton}
            </div>
        `);

        // Simpan marker ke dalam objek markerMap untuk diakses nanti
        markerMap[location.name] = marker;
    });
}

// Fungsi Membuat Tombol Lokasi
function createLocationButtons(data) {
    const buttonContainer = document.getElementById('locationButtons');
    data.forEach(location => {
        const button = document.createElement('button');
        button.textContent = location.name;

        // Event ketika tombol ditekan
        button.onclick = () => {
            flyToLocation(location.coords, location.name);
        };

        buttonContainer.appendChild(button);
    });
}

// Fungsi untuk Fly ke Lokasi dan Membuka Popup
function flyToLocation(coords, name) {
    mainMap.flyTo(coords, 15); // Memindahkan map ke lokasi
    setTimeout(() => {
        markerMap[name].openPopup(); // Membuka popup marker setelah map berpindah
    }, 1000); // Delay untuk memastikan peta sudah berpindah posisi
}

// Tambahkan GeoJSON untuk Semarang Boundary
fetch('assets/js/semarang_boundary.geojson')
    .then(response => response.json())
    .then(data => {
        // Filter hanya untuk fitur yang bukan titik
        const filteredFeatures = data.features.filter(feature => feature.geometry.type !== 'Point');

        const semarangBoundary = L.geoJSON({
            type: 'FeatureCollection',
            features: filteredFeatures
        }, {
            style: {
                color: 'blue',
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.1
            }
        }).addTo(mainMap);

        mainMap.fitBounds(semarangBoundary.getBounds());
    })
    .catch(error => console.error('Error loading GeoJSON:', error));

// Ambil Data dari JSON
fetch('assets/js/mapdb.json')
    .then(response => response.json())
    .then(data => {
        addMarkersFromJSON(data);   // Tambahkan marker ke peta
        createLocationButtons(data); // Generate tombol lokasi
    })
    .catch(error => console.error('Gagal memuat data JSON:', error));

// Fungsi Pencarian
const searchBox = document.getElementById('searchBox');
searchBox.addEventListener('input', function() {
    const searchValue = searchBox.value.trim().toLowerCase();

    fetch('assets/js/mapdb.json')
        .then(response => response.json())
        .then(data => {
            const foundLocation = data.find(location =>
                location.name.toLowerCase().includes(searchValue)
            );

            if (foundLocation) {
                flyToLocation(foundLocation.coords, foundLocation.name);
            }
        });
});

// Detect User Location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        userMarker = L.marker([userLat, userLng]).addTo(mainMap)
            .bindPopup('Your Location')
            .openPopup();

        mainMap.setView([userLat, userLng], 13);
    }, () => {
        alert("Could not get your location.");
    });
}

// Get Route Function
function getRouteTo(destLat, destLng) {
    if (userMarker) {
        if (routingControl) {
            routingControl.remove();
        }

        routingControl = L.Routing.control({
            waypoints: [
                L.latLng(userMarker.getLatLng().lat, userMarker.getLatLng().lng),
                L.latLng(destLat, destLng)
            ],
            routeWhileDragging: true,
            createMarker: function() { return null; } // Prevent default marker creation
        }).addTo(mainMap);

        // Add Close Button to Popup
        routingControl.on('routesfound', function(e) {
            const route = e.routes[0];
            const popupContent = `<b>Route found!</b><br>
                                  Distance: ${route.summary.totalDistance.toFixed(2)} meters<br>
                                  <button class="close-route-button" onclick="closeRoute()">Close</button>`;
            L.popup()
                .setLatLng(route.coordinates[0])
                .setContent(popupContent)
                .openOn(mainMap);
        });
    } else {
        alert("User location not available.");
    }
}

// Close Route Function
function closeRoute() {
    if (routingControl) {
        routingControl.remove();
        routingControl = null; // Reset routing control
    }
}

// Custom Fullscreen Control
const fullscreenControl = L.control({ position: 'topright' });

fullscreenControl.onAdd = function(map) {
    const button = L.DomUtil.create('button', 'fullscreen-btn');
    button.innerHTML = '🗖';
    button.title = 'Toggle Fullscreen';

    const mapDiv = document.getElementById('main-map');
    const overlay = document.getElementById('overlay');
    let isExpanded = false;

    button.onclick = function() {
        if (!isExpanded) {
            mapDiv.classList.add('expanded');
            overlay.classList.add('active');
            button.innerHTML = '❌';
        } else {
            mapDiv.classList.remove('expanded');
            overlay.classList.remove('active');
            button.innerHTML = '🗖';
        }
        isExpanded = !isExpanded;

        // Force map to refresh after transition
        setTimeout(() => {
            mainMap.invalidateSize();
        }, 500); // Sesuaikan dengan waktu animasi di CSS
    };

    return button;
};
fullscreenControl.addTo(mainMap);
