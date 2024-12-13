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

        // Your locations array and markers code here
// Adding Custom Tourist Markers with Detailed Information
const locations = [
    {
        name: "Lawang Sewu",
        coords: [-6.9666, 110.4211],
        description: "Historical building with beautiful architecture.",
        price: "Free",
        address: "Jl. Pemuda No. 30, Sekayu, Kec. Semarang Tengah",
        hours: "Open daily 8 AM - 10 PM"
    },
    {
        name: "Sam Poo Kong",
        coords: [-6.9792, 110.4215],
        description: "Famous temple dedicated to Chinese admiral Cheng Ho.",
        price: "Free",
        address: "Jl. Simongan No. 129, Semarang",
        hours: "Open daily 8 AM - 5 PM"
    },
    {
        name: "Kota Lama",
        coords: [-6.9706, 110.4294],
        description: "Historical area with Dutch colonial buildings.",
        price: "Free",
        address: "Kota Lama, Semarang",
        hours: "Open 24 hours"
    },
    {
        name: "Simpang Lima",
        coords: [-6.9792, 110.4185],
        description: "Popular square with various food stalls and activities.",
        price: "Free",
        address: "Simpang Lima, Semarang",
        hours: "Open 24 hours"
    },
    {
        name: "Masjid Agung Jawa Tengah",
        coords: [-6.9733, 110.4211],
        description: "Grand mosque with stunning architecture.",
        price: "Free",
        address: "Jl. Gubernur Soepardjo No. 1, Semarang",
        hours: "Open daily 24 hours"
    },
    {
        name: "Pantai Marina",
        coords: [-6.9668, 110.4406],
        description: "Beachfront area with recreational activities.",
        price: "IDR 10,000",
        address: "Jl. Marina Raya, Semarang",
        hours: "Open daily 8 AM - 6 PM"
    },
    {
        name: "Pantai Tirang",
        coords: [-6.9344, 110.3674],
        description: "Quiet beach ideal for relaxation.",
        price: "Free",
        address: "Jl. Tirang, Semarang",
        hours: "Open 24 hours"
    },
    {
        name: "Semawis",
        coords: [-6.9733, 110.4297],
        description: "Culinary market with diverse local food.",
        price: "Varies",
        address: "Semawis, Semarang",
        hours: "Open Friday - Sunday 6 PM - 12 AM"
    },
    {
        name: "Taman Indonesia Kaya",
        coords: [-6.9678, 110.4275],
        description: "Park with cultural performances and events.",
        price: "Free",
        address: "Jl. Pahlawan No. 20, Semarang",
        hours: "Open daily 6 AM - 10 PM"
    },
    {
        name: "Grand Maerakaca",
        coords: [-6.9753, 110.4314],
        description: "Cultural park with traditional Javanese houses.",
        price: "IDR 10,000",
        address: "Jl. Anjasmoro, Semarang",
        hours: "Open daily 8 AM - 6 PM"
    },
    {
        name: "Firdaus Fatimah Zahra",
        coords: [-6.9340, 110.4321],
        description: "Culinary spot known for its diverse menu.",
        price: "Varies",
        address: "Jl. Firdaus, Semarang",
        hours: "Open daily 10 AM - 10 PM"
    },
    {
        name: "Nirwana Stable",
        coords: [-6.9895, 110.4257],
        description: "Horse riding facility and recreational area.",
        price: "IDR 50,000",
        address: "Jl. Nirwana, Semarang",
        hours: "Open daily 9 AM - 5 PM"
    },
    {
        name: "Gubug Serut",
        coords: [-6.8616, 110.4206],
        description: "A cozy place with local delicacies.",
        price: "Varies",
        address: "Jl. Gubug Serut, Semarang",
        hours: "Open daily 8 AM - 10 PM"
    },
    {
        name: "Waduk Jatibarang",
        coords: [-6.9829, 110.4438],
        description: "Reservoir with scenic views and outdoor activities.",
        price: "IDR 5,000",
        address: "Jl. Jatibarang, Semarang",
        hours: "Open daily 7 AM - 5 PM"
    },
    {
        name: "Ngrembel Asri",
        coords: [-6.9788, 110.4627],
        description: "Eco-tourism site with nature trails.",
        price: "Free",
        address: "Ngrembel Asri, Semarang",
        hours: "Open 24 hours"
    },
    {
        name: "Gua Kreo",
        coords: [-6.9961, 110.4217],
        description: "Cave with historical significance and natural beauty.",
        price: "IDR 10,000",
        address: "Gua Kreo, Semarang",
        hours: "Open daily 8 AM - 5 PM"
    },
    {
        name: "Thematic Kampung Jawi",
        coords: [-6.9723, 110.4276],
        description: "Cultural village showcasing Javanese traditions.",
        price: "Free",
        address: "Kampung Jawi, Semarang",
        hours: "Open daily 8 AM - 8 PM"
    },
    {
        name: "Dusun Semilir (Kabupaten)",
        coords: [-7.0810, 110.4401],
        description: "Cultural and ecological tourism site.",
        price: "IDR 20,000",
        address: "Dusun Semilir, Semarang",
        hours: "Open daily 9 AM - 5 PM"
    },
    {
        name: "Umbul Sidomukti (Kabupaten)",
        coords: [-7.0905, 110.4388],
        description: "Natural spring and recreational area.",
        price: "IDR 15,000",
        address: "Umbul Sidomukti, Semarang",
        hours: "Open daily 7 AM - 6 PM"
    },
    {
        name: "Curug Benowo dan Lawe (Kabupaten)",
        coords: [-7.0750, 110.4300],
        description: "Beautiful waterfalls for nature lovers.",
        price: "Free",
        address: "Curug Benowo, Semarang",
        hours: "Open daily 8 AM - 5 PM"
    },
    {
        name: "Taman Budaya Raden Saleh",
        coords: [-6.9740, 110.4370],
        description: "Cultural park hosting art events.",
        price: "Free",
        address: "Jl. Raden Saleh, Semarang",
        hours: "Open daily 8 AM - 10 PM"
    },
    {
        name: "Museum Ronggowarsito",
        coords: [-6.9725, 110.4382],
        description: "Museum of Central Java's history and culture.",
        price: "IDR 5,000",
        address: "Jl. Letjen S Parman No. 1, Semarang",
        hours: "Open Tuesday - Sunday 9 AM - 4 PM"
    },
    {
        name: "Puri Maerokoco",
        coords: [-6.9728, 110.4387],
        description: "Cultural park with traditional houses from Central Java.",
        price: "IDR 10,000",
        address: "Jl. Puri Maerokoco, Semarang",
        hours: "Open daily 8 AM - 6 PM"
    },
    {
        name: "Kampung Pelangi",
        coords: [-6.9730, 110.4260],
        description: "Colorful village known for its vibrant houses.",
        price: "Free",
        address: "Kampung Pelangi, Semarang",
        hours: "Open 24 hours"
    },
    {
        name: "Menara Pandang",
        coords: [-6.9720, 110.4310],
        description: "Observation tower with panoramic views of Semarang.",
        price: "IDR 5,000",
        address: "Jl. Menara Pandang, Semarang",
        hours: "Open daily 8 AM - 6 PM"
    },
    {
        name: "Puncak Sewa",
        coords: [-7.0500, 110.4850],
        description: "Hilltop area for hiking and sightseeing.",
        price: "Free",
        address: "Puncak Sewa, Semarang",
        hours: "Open daily 6 AM - 6 PM"
    },
    {
        name: "Taman Sari",
        coords: [-6.9790, 110.4170],
        description: "Public park with gardens and recreational areas.",
        price: "Free",
        address: "Taman Sari, Semarang",
        hours: "Open daily 6 AM - 10 PM"
    },
    {
        name: "Candi Gending",
        coords: [-6.9920, 110.4690],
        description: "Historical temple with stunning architecture.",
        price: "Free",
        address: "Candi Gending, Semarang",
        hours: "Open daily 8 AM - 5 PM"
    },
    {
        name: "Candi Borobudur (nearby)",
        coords: [-7.6070, 110.2025],
        description: "Famous Buddhist temple and UNESCO World Heritage Site.",
        price: "IDR 50,000",
        address: "Borobudur, Magelang",
        hours: "Open daily 6 AM - 5 PM"
    },
    {
        name: "Candi Prambanan (nearby)",
        coords: [-7.7517, 110.4912],
        description: "Beautiful Hindu temple complex.",
        price: "IDR 50,000",
        address: "Prambanan, Sleman",
        hours: "Open daily 6 AM - 5 PM"
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
            L.marker(location.coords)
                .addTo(map)
                .bindPopup(popupContent);
        });
