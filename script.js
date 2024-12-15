const mapContainer = document.getElementById('mapContainer');
const mapElement = document.getElementById('map');
const overlay = document.getElementById('overlay');

const map = L.map('map').setView([-6.9663, 110.4213], 13);

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
    button.innerHTML = '🗖';
    button.title = 'Toggle Fullscreen';

    let isExpanded = false;
    
    button.onclick = function() {
        if (!isExpanded) {
            mapContainer.classList.add('expanded');
            overlay.classList.add('active');
            button.innerHTML = '❌';
        } else {
            mapContainer.classList.remove('expanded');
            overlay.classList.remove('active');
            button.innerHTML = '🗖';
        }
        isExpanded = !isExpanded;

        // Force map to refresh after transition
        setTimeout(() => {
            map.invalidateSize();
        }, 300);
    };

    return button;
};

fullscreenControl.addTo(map);

// Store marker references
const markers = {};

// Updated locations array with the revised descriptions
const locations = [
    {
        name: "Lawang Sewu",
        coords: [-6.9838, 110.4109],
        description: "Museum bersejarah bekas kantor NIS.",
        price: "Rp10.000 – Dewasa, Rp5.000 - Anak",
        address: "Jl. Pemuda No.160, Sekayu, Kec. Semarang Tengah, Kota Semarang, Jawa Tengah 50132",
        hours: "08.00 – 20.00 WIB"
    },
    {
        name: "Sam Poo Kong",
        coords: [-6.9959, 110.3987],
        description: "Kelenteng Buddha tempat persinggahan Cheng Ho.",
        price: "Rp20.000 – Dewasa, Rp15.000 – Anak",
        address: "Sam Poo Kong, Bongsari, Semarang Barat, Semarang City, Central Java 50148",
        hours: "08.00 – 20.00 WIB"
    },
    {
        name: "Kota Lama",
        coords: [-6.9677, 110.4302],
        description: "Kawasan bersejarah dengan arsitektur Belanda.",
        price: "Gratis",
        address: "2CJH+M9F, Tanjung Mas, Semarang Utara, Semarang City, Central Java 50174",
        hours: "24 Jam"
    },
    {
        name: "Simpang Lima",
        coords: [-6.9899, 110.4229],
        description: "Persimpangan utama dengan lapangan Pancasila.",
        price: "Gratis",
        address: "2C5C+VRJ, Jl. Simpang Lima, Mugassari, Kec. Semarang Sel., Kota Semarang, Jawa Tengah 50249",
        hours: "24 Jam"
    },
    {
        name: "Masjid Agung Jawa Tengah",
        coords: [-6.9833, 110.4459],
        description: "Masjid terbesar dengan payung hidrolik.",
        price: "Gratis",
        address: "Jl. Gajah Raya, Sambirejo, Kec. Gayamsari, Kota Semarang, Jawa Tengah 50166",
        hours: "24 Jam"
    },
    {
        name: "Pantai Marina",
        coords: [-6.9484, 110.3908],
        description: "Wisata pantai yang dulunya hutan bakau.",
        price: "Rp10.000",
        address: "29WP+4FC, Tawangsari, Semarang City, Central Java 50144",
        hours: "06.00 – 18.00 WIB"
    },
    {
        name: "Pantai Tirang",
        coords: [-6.9518, 110.3702],
        description: "Pantai indah dari bekas pulau kecil.",
        price: "Rp5.000",
        address: "Tugurejo, Tugu, Semarang City, Central Java 50182",
        hours: "24 Jam"
    },
    {
        name: "Semawis",
        coords: [-6.9741, 110.4278],
        description: "Pasar malam kuliner khas Semarang.",
        price: "Gratis",
        address: "Jl. Kranggan Dalam Jl. Gg. Warung No.50, Kauman, Kec. Semarang Tengah, Kota Semarang, Jawa Tengah 50139",
        hours: "06.00 – 22.00 WIB"
    },
    {
        name: "Taman Indonesia Kaya",
        coords: [-6.9922, 110.4199],
        description: "Taman publik untuk pertunjukan seni.",
        price: "Gratis",
        address: "Jl. Menteri Supeno No.11 A, Mugassari, Kec. Semarang Sel., Kota Semarang, Jawa Tengah 50249",
        hours: "24 Jam"
    },
    {
        name: "Grand Maerakaca",
        coords: [-6.9604, 110.3874],
        description: "Taman dengan rumah adat Jawa Tengah.",
        price: "Rp20.000",
        address: "Jl. Puri Anjasmoro, Tawangsari, Kec. Semarang Barat, Kota Semarang, Jawa Tengah 50114",
        hours: "07.00 – 18.00 WIB"
    },
    {
        name: "Firdaus Fatimah Zahra",
        coords: [-7.0751, 110.3853],
        description: "Tempat manasik haji dengan replika penting.",
        price: "Rp40.000",
        address: "Jl. Muntal, Mangunsari, Kec. Gn. Pati, Kota Semarang, Jawa Tengah 50227",
        hours: "08.00 – 16.00 WIB"
    },
    {
        name: "Nirwana Stable",
        coords: [-7.0777, 110.3388],
        description: "Wisata berkuda dengan pemandangan alam.",
        price: "Rp10.000",
        address: "Purwosari, Mijen, Semarang City, Central Java 50217",
        hours: "10.00 – 17.30 WIB (hari kerja), 08.00 – 19.30 WIB (akhir pekan)"
    },
    {
        name: "Gubug Serut",
        coords: [-7.0393, 110.4051],
        description: "Wisata alam dengan atraksi air.",
        price: "Gratis",
        address: "Jl. Persen Raya, Sekaran, Kec. Gn. Pati, Kota Semarang, Jawa Tengah 50229",
        hours: "06.00 – 18.00 WIB"
    },
    {
        name: "Waduk Jatibarang",
        coords: [-7.0360, 110.3503],
        description: "Waduk yang juga jadi destinasi wisata.",
        price: "Gratis",
        address: "X972+G6P, Jl. Jamalsari Tim. 1, Kedungpane, Kec. Mijen, Kota Semarang, Jawa Tengah 50211",
        hours: "24 Jam"
    },
    {
        name: "Ngrembel Asri",
        coords: [-7.0755, 110.3607],
        description: "Wisata keluarga dengan wahana permainan.",
        price: "Hari kerja Rp4.000, akhir pekan Rp7.000",
        address: "Jl. Raya Manyaran-Gunungpati No.KM 10, Gunungpati, Kec. Gn. Pati, Kota Semarang, Jawa Tengah 50229",
        hours: "08.30 – 22.00 WIB"
    },
    {
        name: "Goa Kreo",
        coords: [-7.0387, 110.3512],
        description: "Goa bersejarah dengan interaksi monyet.",
        price: "Rp8.000",
        address: "Jl. Raya Goa Kreo, Kandri, Kec. Gn. Pati, Kota Semarang, Jawa Tengah 50222",
        hours: "08.00 – 17.00 WIB"
    },
    {
        name: "Dusun Semilir (Kabupaten)",
        coords: [-7.223346380469537, 110.42986202733822],
        description: "Cultural and ecological tourism site.",
        price: "IDR 20,000",
        address: "Jl. Soekarno - Hatta No.49, Ngemple, Bawen, Ngemplak, Kabupaten Semarang",
        hours: "Open daily 9 AM - 5 PM"
    },
    {
        name: "Umbul Sidomukti (Kabupaten)",
        coords: [-7.194366742568373, 110.3733153540462],
        description: "Natural spring and recreational area.",
        price: "IDR 15,000",
        address: "Umbul Sidomukti, Manggung, Jimbaran, Bandungan, Kabupaten Semarang",
        hours: "Open daily 7 AM - 6 PM"
    },
    {
        name: "Curug Benowo dan Lawe (Kabupaten)",
        coords: [-7.156973878504522, 110.35650862154324],
        description: "Beautiful waterfalls for nature lovers.",
        price: "Rp.5000",
        address: "RT.01/RW.06, Hutan, Kalisidi, Ungaran Barat, Semarang Regency",
        hours: "Open daily 8 AM - 5 PM"
    },
    {
        name: "Thematic Kampung Jawi",
        coords: [-7.0290, 110.3782],
        description: "Kuliner tradisional di pinggir kali.",
        price: "Gratis",
        address: "Jl. Kalialang Lama, RT.02/RW.01, Sukorejo, Kec. Gn. Pati, Kota Semarang, Jawa Tengah 50221",
        hours: "04.00 – 22.00 WIB"
    }
];


locations.forEach(location => {
    const popupContent = `
        <strong>${location.name}</strong><br>
        ${location.description}<br>
        <strong>Address:</strong> ${location.address}<br>
        <strong>Price:</strong> ${location.price}<br>
        <strong>Opening Hours:</strong> ${location.hours}
    `;
    const marker = L.marker(location.coords).addTo(map).bindPopup(popupContent);
    markers[location.name] = marker; // Store the marker by name
});

// Handle button clicks to open the corresponding markers
document.querySelectorAll('.btn-custom').forEach(button => {
    button.addEventListener('click', () => {
        const locationName = button.textContent.trim();
        if (markers[locationName]) {
            markers[locationName].openPopup(); // Open the popup for the marker
            map.setView(markers[locationName].getLatLng(), 15); // Optional: zoom in to the marker
        }
    });
});

// Implement search functionality
const searchBox = document.getElementById('searchBox');
searchBox.addEventListener('input', function() {
    const query = searchBox.value.toLowerCase();
    for (const locationName in markers) {
        if (locationName.toLowerCase().includes(query)) {
            markers[locationName].openPopup(); // Open the popup for the matching marker
            map.setView(markers[locationName].getLatLng(), 15); // Zoom in to the marker
            break; // Stop after finding the first match
        }
    }
});
