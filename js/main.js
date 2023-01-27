"use strict";
$(function () {
        mapboxgl.accessToken = MAPBOX_API_KEY;
        let center;
        let map = new mapboxgl.Map({
            container: "map", // container ID
            style: 'mapbox://styles/mapbox/streets-v12', // style URL
            zoom: 6 // starting zoom
        }).addControl(new mapboxgl.NavigationControl());

        let popUpInfo = [{
            address: "3130 Piedmont Rd NE, Atlanta, GA 30305",
            popupHTML: `<span class="p-3">Bones</span>`
        }];

        popUpInfo.forEach((cafe) => {
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
                        zoom: 5,
                    });
                    new mapboxgl.Marker()
                        .setLngLat(coordinates)
                        .addTo(map);
                });
        });

        $("#zoomRange").on('change', function () {
            map.setZoom($(this).val()).setCenter(center)
        });

        let opts = {
            enableHighAccuracy: true,
            timeout: 1000 * 10, //10 seconds
            maximumAge: 1000 * 60 * 5, // 5 minutes
        }

        navigator.geolocation.getCurrentPosition(success, error, opts);

        function success(position) {
            fetchWeather(getData({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
            );
            fetchForecast(getData({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
            );
        }

        function getData({latitude, longitude}) {
            return {
                "lat": latitude,
                "lon": longitude,
                "appid": OPEN_WEATHER_API,
                "units": "imperial"
            };
        }

        function error(error) {
            console.log(error);
        }

        function fetchWeather(props) {
            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/weather?`,
                type: "GET",
                data: props,
                success: function (response) {
                    $('#weather').html(`
                <h2>${response.weather[0].description}</h2>
                <p>Temperature: ${response.main.temp}&deg;F (Feels: ${response.main.feels_like}&deg;F)</p>
                <p>High: ${response.main.temp_max}&deg;F</p>
                <p>Low: ${response.main.temp_min}&deg;F</p>
                <p>Humidity: ${response.main.humidity}</p>
                <p>Atmospheric Pressure: ${response.main.pressure}</p>
            `);
                }
            });
        }

        let temps = [];
        let labels = [];

        function fetchForecast(props) {
            $.ajax({
                    url: `https://api.openweathermap.org/data/2.5/forecast?`,
                    type: "GET",
                    data: props,
                    success: function (response) {
                        let html = '';
                        response.list.forEach(hour => {
                            temps.push(hour.main.temp);
                            // let hours = [0, 3, 6, 9, '12', '15', '18', '21'];
                            let hr = new Date(hour.dt * 1000).getHours();
                            if (hr === 0) {
                                hr = '12A';
                            } else if (hr === 12) {
                                hr = '12P';
                            } else if (hr > 12) {
                                hr -= 12;
                                hr += 'P';
                            } else {
                                hr += 'A'
                            }

                            labels.push(hr);
                            /*html += `<div>
                                <p>DateTime ${new Date(hour.dt * 1000).toLocaleDateString()}</p>
                                <p>Temperature: ${hour.main.temp}&deg;F (Feels: ${hour.main.feels_like}&deg;F)</p>
                                <p>High: ${hour.main.temp_max}&deg;F</p>
                                <p>Low: ${hour.main.temp_min}&deg;F</p>
                                <p>Humidity: ${hour.main.humidity}</p>
                                <p>Atmospheric Pressure: ${hour.main.pressure}</p>
                                <p>Weather: ${hour.weather[0].description}</p>
                                <p>Wind Speed: ${hour.wind.speed}</p>
                                <p>Wind Direction: ${hour.wind.deg}</p>
                                <p>Cloud Cover: ${hour.clouds.all}</p>
                                <hr>
                            </div>`;*/
                        });
                        // $('#forecast').html(html);

                        const plugin = {
                            id: 'customCanvasBackgroundColor',
                            beforeDraw: (chart, args, options) => {
                                const {ctx} = chart;
                                ctx.save();
                                ctx.globalCompositeOperation = 'destination-over';
                                ctx.fillStyle = options.color || '#99ffff';
                                ctx.fillRect(0, 0, chart.width, chart.height);
                                ctx.restore();
                            }
                        };

                        let myChart = new Chart("myChart", {
                            type: "line",
                            data: {
                                labels: labels.slice(0, 8),
                                datasets: [{
                                    fill: true,
                                    backgroundColor: "rgba(171,141,63,0.5)",
                                    borderColor: "rgba(255,255,0,1.0)",
                                    data: temps.slice(0, 8),

                                }]
                            },
                            options: {
                                responsive: true,
                                scales: {
                                    xAxes: [{gridLines: {display: false}}],
                                    yAxes: [{gridLines: {display: true}}]
                                },
                                legend: {display: false}
                            }
                        });
                    }
                }
            );

        }

    }
)
;