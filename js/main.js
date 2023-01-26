"use strict";
$(function () {
    mapboxgl.accessToken = MAPBOX_API_KEY;
    let center;
    let map = new mapboxgl.Map({
        container: "map", // container ID
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        zoom: 3 // starting zoom
    }).addControl(new mapboxgl.NavigationControl());

    let cafeInfo = [{
        address: "3130 Piedmont Rd NE, Atlanta, GA 30305",
        popupHTML: `<span class="p-3">Bones</span>`
    }, {
        address: "Dough Pizzeria Napoletana, Blanco Rd, San Antonio, TX 78216",
        popupHTML: `<span class="p-3">Dough Pizzeria Napoletana</span>`
    }, {
        address: "Café Du Monde",
        popupHTML: `<span class="p-3">Café Du Monde</span>`
    }];

    cafeInfo.forEach((cafe) => {
        placeMarkerAndPopup(cafe, mapboxgl.accessToken, map);
    });

    function placeMarkerAndPopup(cafe, token, map) {
        geocode(cafe.address, token)
            .then(function (coordinates) {
                center = coordinates;
                map.setCenter(coordinates)
                new mapboxgl.Marker()
                    .setLngLat(coordinates)
                    .setPopup(new mapboxgl.Popup().setHTML(cafe.popupHTML))
                    .addTo(map);
            });
    }

    $("#search").click(function () {
        let address = $(this).prev().val();
        geocode(address, mapboxgl.accessToken)
            .then(function (coordinates) {
                center = coordinates;
                map.flyTo({
                    center: coordinates,
                    zoom: 15,
                });
                new mapboxgl.Marker()
                    .setLngLat(coordinates)
                    .addTo(map);
            });
    });

    $("#zoomRange").on('change', function () {
        map.setZoom($(this).val()).setCenter(center)
    });

    let data = {appid: OPEN_WEATHER_API, units: 'imperial', q: "San Antonio,US"};
    let html = "";
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather?`,
        type: "GET",
        data: data,
        success: function (data) {
            $('#weather').html(`
                <h2>${data.weather[0].description}</h2>
                <p>Temperature: ${data.main.temp}&deg;C (Feels: ${data.main.feels_like}&deg;C)</p>
                <p>High: ${data.main.temp_max}&deg;F</p>
                <p>Low: ${data.main.temp_min}&deg;F</p>
                <p>Humidity: ${data.main.humidity}</p>
                <p>Atmospheric Pressure: ${data.main.pressure}</p>
            `);
        }
    });

    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/forecast/daily?`,
        type: "GET",
        data: data,
        success: function (data) {
            html += JSON.stringify(data, null, '\t');
            console.log(html);
        }
    });
});