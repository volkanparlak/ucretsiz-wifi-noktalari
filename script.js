var map = L.map('map').setView([40.764, 30.394], 12);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
}).addTo(map);

var allLocations = [];

fetch('fetch_veri.php')
    .then(response => response.json())
    .then(data => {
        allLocations = data;
        displayLocations(allLocations);
    })
    .catch(error => {
        console.error('Fetch hatası:', error);
    });

function displayLocations(locations) {
    $('#locationsList').empty();

    locations.forEach(function(place) {
        var coords = place.geometry.coordinates;
        var lat = coords[1];
        var lng = coords[0];
        var description = place.properties.description || "";

        var isFormatted = /<\/?[a-z][\s\S]*>/i.test(description);

        var tempElement = document.createElement('div');
        tempElement.innerHTML = description;
        removeUnwantedRows(tempElement, ['FID', 'objectid', 'aktaran', 'aktarimtar']);

        var cleanedHTML = isFormatted ? tempElement.innerHTML : formatData(tempElement);

        if (!cleanedHTML) {
            return;
        }

        var icon = L.divIcon({
            className: 'custom-icon',
            html: '<i class="ri-map-pin-2-fill" style="color: green; font-size: 24px;"></i>',
            iconSize: [24, 24],
            iconAnchor: [12, 24]
        });

        var marker = L.marker([lat, lng], {icon: icon})
            .bindPopup(cleanedHTML)
            .addTo(map);

        var listItemContent = `
            <div class="col-md-4">
                <div class="card mb-4 shadow-sm">
                    <div class="card-body">
                        ${cleanedHTML}
                        <button class="btn btn-success btn-block mt-3" onclick="focusOnLocation(${lat}, ${lng})">
                            <i class="ri-map-pin-2-line"></i> Haritada Göster
                        </button>
                    </div>
                </div>
            </div>`;

        $('#locationsList').append(listItemContent);
    });
}

function removeUnwantedRows(element, unwantedKeywords) {
    var rows = element.querySelectorAll('tr');
    rows.forEach(row => {
        var cells = row.querySelectorAll('td');
        if (cells.length > 0 && unwantedKeywords.includes(cells[0].textContent.trim())) {
            row.remove();
        }
    });
}

function formatData(element) {
    var formattedData = '';
    var lines = element.innerText.split('\n');

    lines.forEach(line => {
        var parts = line.split(/\s+/);
        if (parts.length > 1) {
            var key = parts.shift();
            var value = parts.join(' ');
            formattedData += `<p><strong>${key}:</strong> ${value}</p>`;
        }
    });

    return formattedData;
}

function focusOnLocation(lat, lng) {
    map.setView([lat, lng], 15);
}

document.getElementById('toggleTheme').addEventListener('click', function() {
    if (document.body.classList.contains('night-mode')) {
        document.body.classList.remove('night-mode');
        document.body.classList.add('day-mode');
        this.innerText = 'Gece Modu';
    } else {
        document.body.classList.remove('day-mode');
        document.body.classList.add('night-mode');
        this.innerText = 'Gündüz Modu';
    }
});