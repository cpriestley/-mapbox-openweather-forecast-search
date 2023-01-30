import {OPEN_WEATHER_API_KEY} from "./keys.js";

let temps = [];
let labels = [];
let thisProps = {};

const weather = {

    temps: () => {
        return temps
    },
    labels: () => {
        return labels
    },

    props: function props({latitude, longitude}) {
        thisProps = {
            "lat": latitude,
            "lon": longitude,
            "appid": OPEN_WEATHER_API_KEY,
            "units": "imperial"
        };
        return thisProps;
    },

    getProps: function () {
        return thisProps;
    },

    fetchCurrentWeather: async function (props) {
        return $.ajax({
            url: `https://api.openweathermap.org/data/2.5/weather?`,
            type: "GET",
            data: props,
            success: function (response) {
                return response;
            },
            error: function (error) {
                console.log(error);
            }
        });
    },

    fetchWeatherForecast: async function (props) {
        return $.ajax({
            url: `https://api.openweathermap.org/data/2.5/forecast?`,
            type: "GET",
            data: props,
            success: function (response) {
                return response;
            },
            error: function (error) {
                console.log(error);
            }
        });
    }


}

export {weather};