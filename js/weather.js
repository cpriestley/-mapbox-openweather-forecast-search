import {OPEN_WEATHER_API_KEY} from "./keys.js";

let temps = [];
let labels = [];

const weather = {

    temps: () => { return temps },
    labels: () => { return labels },

    props: function props({latitude, longitude}) {
        return {
            "lat": latitude,
            "lon": longitude,
            "appid": OPEN_WEATHER_API_KEY,
            "units": "imperial"
        };
    },


    fetchCurrentWeather: function (props) {
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
                    <p>Atmospheric Pressure: ${response.main.pressure}</p>`);
            },
            error: function (error) {
                console.log(error);
            }
        });
    },

    fetchWeatherForecast: async function (props) {
        await $.ajax({
                url: `https://api.openweathermap.org/data/2.5/forecast?`,
                type: "GET",
                data: props,
                success: function (response) {
                    let html = '';
                    temps = [];
                    labels = [];
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
                        return {"temps": temps, "labels": labels};
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
                    console.log(JSON.stringify(temps));
                    console.log(JSON.stringify(labels));
                    // $('#forecast').html(html);
                }
            }
        )
    }
}

export {weather};