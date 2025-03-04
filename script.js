// script.js

// Inisialisasi peta
var map = L.map('map').setView([-2.5337, 140.7181], 13);

// Tambahkan tile Google Maps
L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    attribution: '© Google Maps'
}).addTo(map);

// Ikon sekolah berdasarkan jenjang
var schoolIcons = {
    "PAUD": L.icon({ iconUrl: 'red.png', iconSize: [23, 30] }),
    "TK": L.icon({ iconUrl: 'red.png', iconSize: [23, 30] }),
    "SD": L.icon({ iconUrl: 'yellow.png', iconSize: [23, 30] }),
    "SMP": L.icon({ iconUrl: 'green.png', iconSize: [23, 30] }),
    "SMA": L.icon({ iconUrl: 'purple.png', iconSize: [23, 30] }),
   //  "PT": L.icon({ iconUrl: 'blue.png', iconSize: [23, 30] })
};

// Variabel hitung jumlah sekolah
var countSD = 0, countSMP = 0, countSMA = 0, countPAUD = 0, countTK = 0;

// Tambahkan sekolah ke peta
schools.forEach(school => {
    L.marker([school.lat, school.lon], { icon: schoolIcons[school.type] })
        .addTo(map)
        .bindPopup(`
            <b>${school.name}</b><br>
            Jenjang: ${school.type}<br>
            <i>${school.description}</i><br><hr>
            <button onclick="printSchool('${school.name}','${school.type}','${school.alamat}','${school.lat}','${school.lon}', '${school.siswa}',\`${school.gambar}\`)">
                🖨 Print
            </button>
        `);

    // Hitung jumlah sekolah per kategori
    if (school.type === "PAUD") countPAUD++;
    if (school.type === "TK") countTK++;
    if (school.type === "SD") countSD++;
    if (school.type === "SMP") countSMP++;
    if (school.type === "SMA") countSMA++;
   //  if (school.type === "PT") countPT++;
});

// Tampilkan jumlah sekolah di HTML
document.getElementById("count-paud").textContent = countPAUD;
document.getElementById("count-tk").textContent = countTK;
document.getElementById("count-sd").textContent = countSD;
document.getElementById("count-smp").textContent = countSMP;
document.getElementById("count-sma").textContent = countSMA;
// document.getElementById("count-pt").textContent = countPT;

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
