"use strict";
import {chart} from "./chart.js";
import {weather} from "./weather.js";
import {mapbox} from "./map.js";

$(function () {

        $("#breezy").click(function (event) {
            event.preventDefault();
            let opts = {
                enableHighAccuracy: true,
                timeout: 1000 * 10, //10 seconds
                maximumAge: 1000 * 60 * 5, // 5 minutes
            }
            navigator
                .geolocation
                .getCurrentPosition(success, (error => console.log(error)), opts);
        });

        function success(position) {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;
            let props = getProps(latitude, longitude);
            mapbox.flyToLocation([longitude, latitude]);
            weather.fetchCurrentWeather(props);
            weather.fetchWeatherForecast(props)
                .then(() => {
                    let temps = weather.temps();
                    chart.destroy();
                    chart.update(temps);
                });
        }

        function getProps(latitude, longitude) {
            return weather.props({latitude, longitude});
        }

        $("#search").click(function () {
            let address = $(this).prev().val();
            geocode(address, mapboxgl.accessToken)
                .then((coordinates) => {
                    mapbox.flyToLocation(coordinates);
                    let latitude = coordinates[1];
                    let longitude = coordinates[0];
                    let props = getProps(latitude, longitude);
                    weather.fetchCurrentWeather(props);
                    weather.fetchWeatherForecast(props)
                        .then(() => {
                            let temps = weather.temps();
                            chart.destroy();
                            chart.update(temps);
                        })
                });
        });

        mapbox.init();

    }
)
;