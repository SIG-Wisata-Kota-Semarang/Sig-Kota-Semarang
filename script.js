const map = L.map('map').setView([-6.9663, 110.4213], 13); // Center on Semarang

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

navigator.geolocation.watchPosition(success, error);

function success(pos) {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const accuracy = pos.coords.accuracy;

    L.marker([lat, lng]).addTo(map).bindPopup('You are here!').openPopup();
    L.circle([lat, lng], { radius: accuracy }).addTo(map);
    map.setView([lat, lng]);
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

// Custom Fullscreen Control
const fullscreenControl = L.control({ position: 'topright' });

fullscreenControl.onAdd = function(map) {
    const button = L.DomUtil.create('button', 'fullscreen-btn');
    button.innerHTML = '🗖'; // Initial icon
    button.style.backgroundColor = 'white';
    button.style.border = 'none';
    button.style.padding = '10px';
    button.style.cursor = 'pointer';
    button.title = 'Toggle Fullscreen';

    const mapContainer = document.getElementById('map'); // Map element
    let isExpanded = false; // Fullscreen status
    const originalSize = { width: mapContainer.style.width, height: mapContainer.style.height };

    button.onclick = function () {
        if (!isExpanded) {
            // Enter fullscreen mode
            mapContainer.style.width = '90vw';
            mapContainer.style.height = '80vh';
            mapContainer.style.margin = '5vh auto';
            button.innerHTML = '❌';
        } else {
            // Return to original size
            mapContainer.style.width = originalSize.width || '600px';
            mapContainer.style.height = originalSize.height || '400px';
            mapContainer.style.margin = '0';
            button.innerHTML = '🗖';
        }
        isExpanded = !isExpanded;

        // Center the map after size change
        setTimeout(() => {
            map.invalidateSize();
            map.setView(map.getCenter()); // Keep centered
        }, 300); // Delay to allow DOM changes
    };

    return button;
};

fullscreenControl.addTo(map);

// Resize map when entering/exiting fullscreen via browser API
document.addEventListener('fullscreenchange', () => {
    setTimeout(() => {
        map.invalidateSize();
        map.setView(map.getCenter());
    }, 300);
});

// Adding Custom Tourist Markers
const locations = [
    { name: "Lawang Sewu", coords: [-6.9666, 110.4211] },
    { name: "Sam Poo Kong", coords: [-6.9792, 110.4215] },
    { name: "Kota Lama", coords: [-6.9706, 110.4294] },
    { name: "Simpang Lima", coords: [-6.9792, 110.4185] },
    { name: "Masjid Agung Jawa Tengah", coords: [-6.9733, 110.4211] },
    { name: "Pantai Marina", coords: [-6.9668, 110.4406] },
    { name: "Pantai Tirang", coords: [-6.9344, 110.3674] },
    { name: "Semawis", coords: [-6.9733, 110.4297] },
    { name: "Taman Indonesia Kaya", coords: [-6.9678, 110.4275] },
    { name: "Grand Maerakaca", coords: [-6.9753, 110.4314] },
    { name: "Firdaus Fatimah Zahra", coords: [-6.9340, 110.4321] },
    { name: "Nirwana Stable", coords: [-6.9895, 110.4257] },
    { name: "Gubug Serut", coords: [-6.8616, 110.4206] },
    { name: "Waduk Jatibarang", coords: [-6.9829, 110.4438] },
    { name: "Ngrembel Asri", coords: [-6.9788, 110.4627] },
    { name: "Gua Kreo", coords: [-6.9961, 110.4217] },
    { name: "Thematic Kampung Jawi", coords: [-6.9723, 110.4276] },
    { name: "Dusun Semilir (Kabupaten)", coords: [-7.0810, 110.4401] },
    { name: "Umbul Sidomukti (Kabupaten)", coords: [-7.0905, 110.4388] },
    { name: "Curug Benowo dan Lawe (Kabupaten)", coords: [-7.0750, 110.4300] },
    { name: "Taman Budaya Raden Saleh", coords: [-6.9740, 110.4370] },
    { name: "Museum Ronggowarsito", coords: [-6.9725, 110.4382] },
    { name: "Puri Maerokoco", coords: [-6.9728, 110.4387] },
    { name: "Kampung Pelangi", coords: [-6.9730, 110.4260] },
    { name: "Menara Pandang", coords: [-6.9720, 110.4310] },
    { name: "Puncak Sewa", coords: [-7.0500, 110.4850] },
    { name: "Taman Sari", coords: [-6.9790, 110.4170] },
    { name: "Candi Gending", coords: [-6.9920, 110.4690] },
    { name: "Candi Borobudur (nearby)", coords: [-7.6070, 110.2025] }, // For nearby attractions
    { name: "Candi Prambanan (nearby)", coords: [-7.7517, 110.4912] } // For nearby attractions
];

locations.forEach(location => {
    L.marker(location.coords)
        .addTo(map)
        .bindPopup(location.name);
});
