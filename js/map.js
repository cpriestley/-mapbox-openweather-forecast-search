import {MAPBOX_API_KEY} from "./keys.js";

let map;
mapboxgl.accessToken = MAPBOX_API_KEY;

const mapbox = {

    init: function () {
        map = new mapboxgl.Map({
            container: "map", // container ID
            style: 'mapbox://styles/mapbox/navigation-night-v1', // style URL
            zoom: 0.25 // starting zoom
        }).addControl(new mapboxgl.NavigationControl());
    },

    flyToLocation: function (coordinates) {
        map.flyTo({
            duration: 800,
            center: coordinates,
            zoom: 8,
        });
        // new mapboxgl.Marker()
        //     .setLngLat(coordinates)
        //     .addTo(map);
    }
}

export {mapbox};