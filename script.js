// script.js

var map = L.map('map').setView([-2.5337, 140.7181], 13);

L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    attribution: '© Google Maps'
}).addTo(map);

var schoolIcons = {
    "PAUD": L.icon({ iconUrl: 'red.png', iconSize: [20, 30] }),
    "TK": L.icon({ iconUrl: 'red.png', iconSize: [20, 30] }),
    "SD": L.icon({ iconUrl: 'yellow.png', iconSize: [20, 30] }),
    "SMP": L.icon({ iconUrl: 'green.png', iconSize: [20, 30] }),
    "SMA": L.icon({ iconUrl: 'purple.png', iconSize: [20, 30] })
};

var countSD = 0, countSMP = 0, countSMA = 0, countPAUD = 0, countTK = 0;
var popupLine;
var userMarker = null;
var userLatLng = null;
var routingControl = null;

function getUserLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(
            function(position) {
                userLatLng = [position.coords.latitude, position.coords.longitude];

                if (userMarker) {
                    userMarker.setLatLng(userLatLng);
                } else {
                    userMarker = L.marker(userLatLng, {
                        icon: L.icon({ iconUrl: 'user.png', iconSize: [30, 30] })
                    }).addTo(map).bindPopup("Posisi Anda");
                }

                map.setView(userLatLng, 14);
            },
            function(error) {
                console.error("Gagal mendapatkan lokasi: ", error);
            },
            { enableHighAccuracy: true }
        );
    } else {
        alert("Geolocation tidak didukung di browser ini.");
    }
}

getUserLocation();

function showRoute(destinationLatLng) {
    if (!userLatLng) {
        alert("Lokasi Anda tidak ditemukan! Pastikan GPS aktif.");
        return;
    }

    if (routingControl) {
        map.removeControl(routingControl);
    }
    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(userLatLng),
            L.latLng(destinationLatLng)
        ],
        routeWhileDragging: true
    }).addTo(map);
}

function closeRoute() {
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }
}

function getPopupPosition(markerLatLng) {
    var bounds = map.getBounds();
    var mapHeight = bounds.getNorth() - bounds.getSouth();
    var verticalOffset = (Math.random() - 0.5) * mapHeight * 0.2;
    var leftLatLng = [
        markerLatLng[0] + verticalOffset,
        bounds.getWest() + (bounds.getEast() - bounds.getWest()) * 0.15
    ];
    return leftLatLng;
}

schools.forEach(school => {
    var marker = L.marker([school.lat, school.lon], { icon: schoolIcons[school.type] }).addTo(map);

    marker.on('click', function() {
        if (popupLine) {
            map.removeLayer(popupLine);
        }

        var popupLatLng = getPopupPosition([school.lat, school.lon]);

        popupLine = L.polyline([[school.lat, school.lon], popupLatLng], { 
            color: 'black', 
            weight: 3 
        }).addTo(map);

        var popup = L.popup({ autoPan: false })
            .setLatLng(popupLatLng)
            .setContent(`
                <b>${school.name}</b><br>
                Jenjang: ${school.type}<br>
                <i>${school.description}</i><br><hr>
                <button onclick="showRoute([${school.lat}, ${school.lon}])">
                    📍 Tunjukkan Rute
                </button>
                <button onclick="closeRoute()">
                    ❌ Tutup Rute
                </button>
                <button onclick="printSchool('${school.name}','${school.type}','${school.alamat}','${school.lat}','${school.lon}', '${school.siswa}',\`${school.gambar}\`)">
                    🖨 Print
                </button>
            `)
            .openOn(map);
    });

    map.on('popupclose', function() {
        if (popupLine) {
            map.removeLayer(popupLine);
        }
    });

    if (school.type === "PAUD") countPAUD++;
    if (school.type === "TK") countTK++;
    if (school.type === "SD") countSD++;
    if (school.type === "SMP") countSMP++;
    if (school.type === "SMA") countSMA++;
});

document.getElementById("count-paud").textContent = countPAUD;
document.getElementById("count-tk").textContent = countTK;
document.getElementById("count-sd").textContent = countSD;
document.getElementById("count-smp").textContent = countSMP;
document.getElementById("count-sma").textContent = countSMA;

function printSchool(name, type, alamat, lat, lon, siswa, gambar) {
    let printWindow = window.open('', '', 'width=1080,height=720');
    printWindow.document.write(`
        <html>
        <head>
            <title>Print Data Sekolah</title>
            <style>
                body { font-family: Arial, sans-serif; }
                h2 { text-align: center; }
                .container { padding: 20px; }
            </style>
        </head>
        <body>
           <div class="container">
                <h2>${name}</h2>
                <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; border-collapse: collapse;">
                    <tr><th>Jenjang</th><td>${type}</td></tr>
                    <tr><th>Alamat</th><td>${alamat}</td></tr>
                    <tr><th>Titik Lokasi</th><td>${lat}, ${lon}</td></tr>
                    <tr><th>Jumlah Siswa</th><td>${siswa}</td></tr>
                    <tr><th>Gambar</th><td>${gambar}</td></tr>
                </table>
            </div>
            <script>
                window.onload = function() {
                    window.print();
                    setTimeout(() => window.close(), 500);
                };
            <\/script>
        </body>
        </html>
    `);
    printWindow.document.close();
}
