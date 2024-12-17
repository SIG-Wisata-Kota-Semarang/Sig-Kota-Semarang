// Inisialisasi Map Utama
const mainMap = L.map('main-map').setView([-6.9826, 110.4145], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
}).addTo(mainMap);

// Objek untuk menyimpan marker berdasarkan ID atau nama
const markerMap = {};

// Fungsi Menambahkan Marker dari JSON
function addMarkersFromJSON(data) {
    data.forEach(location => {
        // Tambahkan marker
        const marker = L.marker(location.coords).addTo(mainMap);
        marker.bindPopup(`
            <div style="line-height: 1.2; font-size: 14px; margin: 5px;">
                <b>${location.name}</b><br>
                ${location.shortdescription}<br>
                <strong>Alamat:</strong> ${location.address}<br>
                <strong>Harga Tiket:</strong> ${location.price}<br>
                <strong>Jam Buka:</strong> ${location.hours}
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

// Deteksi Lokasi Pengguna
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        L.marker([userLat, userLng]).addTo(mainMap)
            .bindPopup('Lokasi Anda saat ini')
            .openPopup();

        mainMap.setView([userLat, userLng], 13);
    });
} else {
    alert("Geolocation tidak didukung oleh browser ini.");
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
