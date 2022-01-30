const menudiv = document.getElementById('menudiv');
const menuItems = document.getElementById('menuitems');
const mainButton = document.querySelector('#menu');
const friendButton = document.querySelector('.fa-user-friends')
const infopane = document.querySelector('#info')
const loading = document.getElementById("loading")

mainButton.addEventListener('click', call911);
friendButton.addEventListener('click', call911);

mainButton.addEventListener('mouseover', showMenu);
mainButton.addEventListener('touchstart', showMenu);
menudiv.addEventListener('mouseleave', hideMenu);
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
    urlencoded.append('Url', 'https://raw.githubusercontent.com/TonyxSun/mapbox/master/voice.xml');
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
    loading.style.display = 'block';

    setTimeout(function () {
        loading.style.display = 'none';
        getRoute([-79.386871, 43.659225]);
    }, 10000);
}


mapboxgl.accessToken = 'pk.eyJ1IjoidG9ueXhzdW4iLCJhIjoiY2t6MDJqazd4MTg2ZzJxcDFlM2g4djg0ciJ9.GY5feDZWRZ6GsVKc-N1W_A'; //Mapbox token 
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // style: https://docs.mapbox.com/api/maps/#styles
    center: [-76.49500, 44.22500], // starting position [lng, lat]
    zoom: 14,// starting zoom
    // transformRequest: transformRequest
});

// Add geolocate control to the map.
var geolocate = new mapboxgl.GeolocateControl();

map.addControl(geolocate);
let lon = 0;
let lat = 0;
let position = geolocate.on('geolocate', function (e) {
    var lon = e.coords.longitude;
    var lat = e.coords.latitude;
    start = [lon, lat]
});

let start = [-76.49500, 44.22500];

// create a function to make a directions request
async function getRoute(end) {
    // make a directions request using cycling profile
    // an arbitrary start will always be the same
    // only the end or destination will change
    const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
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
    let responder = '<img id="truck" src="./assets/truck.png" alt="truck" /><br><br>  <h2>Responding:</h2><strong>\n\nTruck 81</strong><br><sub>Social Credit: 2200</sub>';
    info.innerHTML = `<img id="siren" src="./assets/siren.png" alt="siren" /><br><br> <h2>Help is coming</h2><sub>Time</sub><br><strong>${Math.floor(
        data.duration / 60
    )} minutes </strong> <br> <sub> Distance </sub><br> <strong>${Math.floor(data.distance / 10) / 100} km </strong> <br><br><br><br><br>` + responder;
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


