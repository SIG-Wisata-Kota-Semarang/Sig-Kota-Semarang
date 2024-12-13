const map = L.map('map').setView([51.505, -0.09], 13);

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