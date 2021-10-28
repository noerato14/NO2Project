
document.addEventListener("DOMContentLoaded", function(event) { 
    let seriesData = [];
    lineCharData(seriesData);
});

var lineCharData = async ( seriesData) => {
    Highcharts.chart('container', {

        title: {
            text: 'Nivel de Dióxido de Nitrogeno (NO2)'
        },
    
        subtitle: {
            text: 'Source: Google Earth Engine'
        },
    
        yAxis: {
            title: {
                text: 'Niveles de Concentración de NO2 en mol/m^2'
            }
        },
    
        xAxis: {
            type: 'datetime',
            labels: {
                format: '{value:%Y-%m-%e}'
            },
        },
    
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
    
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                }
            }
        },
    
        series: [{
            name: 'NO2',
            data: seriesData
        }],
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    
    });
}


var map = L.map('map-template').setView([-12.046374, -77.042793], 13)
const socket = io();
var isAvailable = true;
var layerGroup = L.layerGroup().addTo(map);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

map.locate({enableHighAccuracy: true});

map.on('locationfound', e => {
    const coords = [e.latlng.lat, e.latlng.lng]
    const marker = L.marker(coords);
    marker.bindPopup('Te estoy Observando');
    map.addLayer(marker);
});



map.on('click', function(e) {
    if (isAvailable) {
        layerGroup.clearLayers();
        map.closePopup();
        var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
        marker.addTo(layerGroup);
        socket.emit('userCoordinates', e.latlng)
        isAvailable = false;
    }
});

socket.on('markerInfo', (res) => {
    console.log(res)
    let seriesData = res.timeseries;
    lineCharData(seriesData);
    isAvailable = true;
})
/* 
socket.on('newUserCoordinates', (coords) => {
    console.log('New user is connected');
    const marker = L.marker([coords.lat + 0.001, coords.lng+ 0.001]);
    marker.bindPopup('Hello there!');
    map.addLayer(marker);
})
*/