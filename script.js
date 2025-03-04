// script.js

// Inisialisasi peta
var map = L.map('map').setView([-2.5337, 140.7181], 13);

// Tambahkan tile Google Maps
L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    attribution: '© Google Maps'
}).addTo(map);

// Ikon sekolah berdasarkan jenjang
var schoolIcons = {
    "PAUD": L.icon({ iconUrl: 'red.png', iconSize: [20, 30] }),
    "TK": L.icon({ iconUrl: 'red.png', iconSize: [20, 30] }),
    "SD": L.icon({ iconUrl: 'yellow.png', iconSize: [20, 30] }),
    "SMP": L.icon({ iconUrl: 'green.png', iconSize: [20, 30] }),
    "SMA": L.icon({ iconUrl: 'purple.png', iconSize: [20, 30] })
};

// Variabel hitung jumlah sekolah
var countSD = 0, countSMP = 0, countSMA = 0, countPAUD = 0, countTK = 0;

// Variabel untuk menyimpan garis sementara
var popupLine;

// Fungsi untuk mendapatkan koordinat popup di sebelah kiri dengan posisi vertikal yang dinamis
function getPopupPosition(markerLatLng) {
    var bounds = map.getBounds(); // Dapatkan batas peta saat ini
    var mapHeight = bounds.getNorth() - bounds.getSouth(); // Hitung tinggi peta
    var verticalOffset = (Math.random() - 0.5) * mapHeight * 0.2; // Variasi vertikal (10% dari tinggi peta)

    var leftLatLng = [
        markerLatLng[0] + verticalOffset, // Posisi vertikal dinamis
        bounds.getWest() + (bounds.getEast() - bounds.getWest()) * 0.15 // 15% dari lebar peta
    ];
    return leftLatLng;
}

// Tambahkan sekolah ke peta
schools.forEach(school => {
    var marker = L.marker([school.lat, school.lon], { icon: schoolIcons[school.type] }).addTo(map);

    // Tambahkan event listener untuk membuat garis dari marker ke popup
    marker.on('click', function() {
        // Hapus garis sebelumnya jika ada
        if (popupLine) {
            map.removeLayer(popupLine);
        }

        // Tentukan posisi popup di sebelah kiri dengan posisi vertikal yang dinamis
        var popupLatLng = getPopupPosition([school.lat, school.lon]);

        // Tambahkan garis dari marker ke popup
        popupLine = L.polyline([[school.lat, school.lon], popupLatLng], { 
            color: 'black', 
            weight: 3 // Garis lebih tebal
        }).addTo(map);

        // Tampilkan popup di posisi yang baru
        var popup = L.popup({ autoPan: false }) // Matikan auto-pan agar peta tidak bergeser
            .setLatLng(popupLatLng)
            .setContent(`
                <b>${school.name}</b><br>
                Jenjang: ${school.type}<br>
                <i>${school.description}</i><br><hr>
                <button onclick="printSchool('${school.name}','${school.type}','${school.alamat}','${school.lat}','${school.lon}', '${school.siswa}',\`${school.gambar}\`)">
                    🖨 Print
                </button>
            `)
            .openOn(map);
    });

    // Hapus garis saat popup ditutup
    map.on('popupclose', function() {
        if (popupLine) {
            map.removeLayer(popupLine);
        }
    });

    // Hitung jumlah sekolah per kategori
    if (school.type === "PAUD") countPAUD++;
    if (school.type === "TK") countTK++;
    if (school.type === "SD") countSD++;
    if (school.type === "SMP") countSMP++;
    if (school.type === "SMA") countSMA++;
});

// Tampilkan jumlah sekolah di HTML
document.getElementById("count-paud").textContent = countPAUD;
document.getElementById("count-tk").textContent = countTK;
document.getElementById("count-sd").textContent = countSD;
document.getElementById("count-smp").textContent = countSMP;
document.getElementById("count-sma").textContent = countSMA;


// Fungsi Print Data Sekolah
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
