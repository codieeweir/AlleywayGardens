// map.js
const zoneCoordinates = {
    'North Belfast': {
        centre: [54.630, -5.930],
        zoom: 13
    },
    'South Belfast': {
        centre: [54.560, -5.930],
        zoom: 13
    },
    'East Belfast': {
        centre: [54.597, -5.860],
        zoom: 13
    },
    'West Belfast': {
        centre: [54.597, -5.990],
        zoom: 13
    }
}

var map = L.map('map').setView([54.597, -5.930], 12);

if (currentZone && zoneCoordinates[currentZone]) {
    const zoneData = zoneCoordinates[currentZone];
    map.setView(zoneData.centre, zoneData.zoom)
}
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    },
    draw: {
        polygon: true,
        polyline: true,
        rectangle: true,
        circle: true,
        marker: true
    }
});
map.addControl(drawControl);

map.on('draw:created', function (e) {
    var layer = e.layer;
    drawnItems.addLayer(layer);


    if(layer instanceof L.Marker){
        handleMarker(layer);
    } else {

        handleShape(layer);
    }
});


function handleMarker(marker){
    var formHtml = `
    <h3> Located a possible project area?</h3>
    <a href="/create-project"> Create new project here </a>
    `;

    var popup = marker.bindPopup(formHtml).openPopup();

    document.getElementById('saveMarker').addEventListener('click', function () {
        var name = document.getElementById('name').value;
        var caption = document.getElementById('caption').value;

        marker.setPopupContent(`
            <strong>${name}</strong><br>
            ${caption}
        `);

    });
}

