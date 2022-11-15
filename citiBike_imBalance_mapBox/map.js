mapboxgl.accessToken = 'pk.eyJ1IjoiZ3YyMzI1IiwiYSI6ImNsNmN1dWZ2MzBldmEzanAyNGswOXZvaXcifQ.d-fWIIjKWTFb5QaB_N1ISg';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/gv2325/cl6fajk51002g14qxti1wrpmb',
    zoom: 10.5,
    center: [-74, 40.725]
});

map.on('load', function () {
    let mapLayers = map.getStyle().layers;
    for (let i = 0; i < mapLayers.length; i++) {
        console.log(mapLayers[i].id);
        
    }
    map.addLayer({
        'id': 'citibikeData',
        'type': 'circle',
        'source': {
            'type': 'geojson',
            'data': 'data/citiGeo.geojson'
        },
        'paint': {
            'circle-color': ['interpolate', ['linear'], ['get', 'difference'],
                0, '#ffffff',
                50, '#ffba31',
                100, '#ff4400',
            ],
            'circle-stroke-color': '#4d4d4d',
            'circle-stroke-width': 0.5,
            'circle-radius': ['interpolate', ['exponential', 2], ['zoom'],
                10.5, ['interpolate', ['linear'], ['get', 'difference'],
                    0, 1,
                    100, 5],
                15, ['interpolate', ['linear'], ['get', 'difference'],
                    0, 5,
                    100, 80]
            ]
        }
    }, 'road-label-simple');
    map.addLayer({
        'id': 'mhhi',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': 'data/medianIncome.geojson'
        },
        'paint': {
            'fill-color': ['step', ['get', 'MHHI'],
                '#ffffff',
                20000, '#ccedf5',
                50000, '#99daea',
                75000, '#66c7e0',
                100000, '#33b5d5',
                150000, '#00a2ca'],
            'fill-opacity': ['case', ['==', ['get', 'MHHI'], null], 0, 0.65]
        }
    }, 'citibikeData');
});

map.on('click', 'citibikeData', function(e){
    let stationID = e.features[0].properties["start station id"];
    let countweek1 = e.features[0].properties["countWeek1"];
    let countweek4 = e.features[0].properties["countWeek4"];
    let difference = e.features[0].properties["difference"];

    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('Station ID: ' + stationID + '<hr><br>' + 'Difference: ' + difference + '%' + '<br>' + 'Count Week 1: ' + countweek1 + '<br>' + 'Count Week 4: ' + countweek4)
        .addTo(map);
});

map.on('mouseenter', 'citibikeData', function(){
    map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'citibikeData', function(){
    map.getCanvas().style.cursor = '';
});

map.addControl(
    new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
    })
);