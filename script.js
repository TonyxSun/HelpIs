const menudiv = document.getElementById('menudiv');
const menuItems = document.getElementById('menuitems');
const mainButton = document.querySelector('#menu');
const friendButton = document.querySelector('.fa-user-friends')
const infopane = document.querySelector('#info')

mainButton.addEventListener('click', call911);
friendButton.addEventListener('click', call911);

mainButton.addEventListener('mouseover', showMenu);
menudiv.addEventListener('mouseout', hideMenu);
function showMenu() {
    menudiv.style.display = "block";
}
function hideMenu() {
    menudiv.style.display = "none";
}


function call911(e) {
    console.log(e.target.innerHTML);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic QUMxYmY4ZjljMmM1N2Y5MzkzZjRmNGRjNzFiMWE4YTY3ZjozNzQ2YWJlOGIwOTllNDE3ZWVjNDI3NmZlNTg5ZGM0Nw==");
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("Url", "http://demo.twilio.com/docs/voice.xml");
    urlencoded.append("To", "+16812990111");
    urlencoded.append("From", "+12264077191");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    fetch("https://api.twilio.com/2010-04-01/Accounts/AC1bf8f9c2c57f9393f4f4dc71b1a8a67f/Calls.json", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    getRoute([-76.48009,44.22988])
}

// var transformRequest = (url, resourceType) => {
//     var isMapboxRequest =
//     url.slice(8, 22) === "api.mapbox.com" ||
//     url.slice(10, 26) === "tiles.mapbox.com";
//     return {
//     url: isMapboxRequest
//         ? url.replace("?", "?pluginName=sheetMapper&")
//         : url
//     };
// };

mapboxgl.accessToken = 'pk.eyJ1IjoidG9ueXhzdW4iLCJhIjoiY2t6MDJqazd4MTg2ZzJxcDFlM2g4djg0ciJ9.GY5feDZWRZ6GsVKc-N1W_A'; //Mapbox token 
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // style: https://docs.mapbox.com/api/maps/#styles
    center: [-76.49500, 44.22500], // starting position [lng, lat]
    zoom: 12,// starting zoom
    // transformRequest: transformRequest
});

const start = [-76.49500, 44.22500];
// $(document).ready(function () {
//     $.ajax({
//     type: "GET",
//     //YOUR TURN: Replace with csv export link
//     url: 'https://docs.google.com/spreadsheets/d/1KC9KB8DBwqSWNSiPWcuyZx4VR4sfhO1rj-rzH88X37Q/gviz/tq?tqx=out:csv&sheet=SFFoodBankData',
//     dataType: "text",
//     success: function (csvData) { makeGeoJSON(csvData); }
//     });



//     function makeGeoJSON(csvData) {
//     csv2geojson.csv2geojson(csvData, {
//         latfield: 'Latitude',
//         lonfield: 'Longitude',
//         delimiter: ','
//     }, function (err, data) {
//         map.on('load', function () {

//         //Add the the layer to the map
//         map.addLayer({
//             'id': 'csvData',
//             'type': 'circle',
//             'source': {
//             'type': 'geojson',
//             'data': data
//             },
//             'paint': {
//             'circle-radius': 5,
//             'circle-color': "purple"
//             }
//         });


//         // When a click event occurs on a feature in the csvData layer, open a popup at the
//         // location of the feature, with description HTML from its properties.
//         map.on('click', 'csvData', function (e) {
//             var coordinates = e.features[0].geometry.coordinates.slice();

//             //set popup text
//             //You can adjust the values of the popup to match the headers of your CSV.
//             // For example: e.features[0].properties.Name is retrieving information from the field Name in the original CSV.
//             var description = `<h3>` + e.features[0].properties.Name + `</h3>` + `<h4>` + `<b>` + `Address: ` + `</b>` + e.features[0].properties.Address + `</h4>` + `<h4>` + `<b>` + `Phone: ` + `</b>` + e.features[0].properties.Phone + `</h4>`;

//             // Ensure that if the map is zoomed out such that multiple
//             // copies of the feature are visible, the popup appears
//             // over the copy being pointed to.
//             while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
//             coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
//             }

//             //add Popup to map

//             new mapboxgl.Popup()
//             .setLngLat(coordinates)
//             .setHTML(description)
//             .addTo(map);
//         });

//         // Change the cursor to a pointer when the mouse is over the places layer.
//         map.on('mouseenter', 'csvData', function () {
//             map.getCanvas().style.cursor = 'pointer';
//         });

//         // Change it back to a pointer when it leaves.
//         map.on('mouseleave', 'places', function () {
//             map.getCanvas().style.cursor = '';
//         });

//         var bbox = turf.bbox(data);
//         map.fitBounds(bbox, { padding: 50 });

//         });

//     });
//     };
// });


// create a function to make a directions request
async function getRoute(end) {
    // make a directions request using cycling profile
    // an arbitrary start will always be the same
    // only the end or destination will change
    const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
    );
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;
    const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: route
        }
    };
    // if the route already exists on the map, we'll reset it using setData
    if (map.getSource('route')) {
        map.getSource('route').setData(geojson);
    }
    // otherwise, we'll make a new request
    else {
        map.addLayer({
            id: 'route',
            type: 'line',
            source: {
                type: 'geojson',
                data: geojson
            },
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#3887be',
                'line-width': 5,
                'line-opacity': 0.75
            }
        });
    }
    // get the sidebar and add the info
    const info = document.getElementById('info');
    const steps = data.legs[0].steps;
    info.innerHTML = `<p><strong>Trip duration: ${Math.floor(
        data.duration / 60
    )} min`;
    info.style.display = 'block';
}

function directions() {
    // make an initial directions request that
    // starts and ends at the same location
    
    getRoute(start);

    // Add starting point to the map
    map.addLayer({
        id: 'point',
        type: 'circle',
        source: {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'Point',
                            coordinates: start
                        }
                    }
                ]
            }
        },
        paint: {
            'circle-radius': 10,
            'circle-color': '#3887be'
        }
    });
};


