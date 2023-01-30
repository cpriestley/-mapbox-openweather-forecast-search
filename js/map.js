import {MAPBOX_API_KEY} from "./keys.js";

let map;
mapboxgl.accessToken = MAPBOX_API_KEY;

const mapbox = {
    resize: function () {
        map.resize();
    },
    init: function () {
        map = new mapboxgl.Map({
            container: "map", // container ID
            trackResize: true,
            style: 'mapbox://styles/mapbox/streets-v12', // style URL
            zoom: 0.25 // starting zoom
        })
        .addControl(new mapboxgl.NavigationControl())
        /*.addControl(new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
        }))*/;
    },

    flyToLocation: function (coordinates) {
        map.flyTo({
            duration: 800,
            center: coordinates,
            zoom: 8,
        });
        new mapboxgl.Marker()
            .setLngLat(coordinates)
            .addTo(map);
    }
}

export {mapbox};