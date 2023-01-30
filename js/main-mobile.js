import {mapbox} from "./map.js";

$(function () {
    "use strict";

    $("body").removeClass("preload");

    let lastTop = 0;
    let div = $("header>div");
    let btn = $("header>div>button");
    let clouds = $("#clouds");
    let header = $("#header");
    let map = $("#map");
    let main = document.querySelector("main");

    $("#btn-modal").click(function () {
        map.attr("style", "height: 100%; width: 100%;");
        map.appendTo(".modal-body");
        map.removeClass("rounded-5");
        mapbox.resize();
    });

    $(".btn-close").click(function () {
        map.removeAttr("style");
        map.appendTo("#bottom");
        map.addClass("rounded-5");
        mapbox.resize();
    });

    $(window).scroll(scrollFunction);
    let TOP_PADDING = 256;

    function scrollFunction() {
        let top = main.getBoundingClientRect().top + TOP_PADDING;
        let isAscendingAndAboveThreshold = top < 200 && top < lastTop;
        let isDescendingAndBelowThreshold = top > 50 && top > lastTop;
        let cloudsVisible = clouds.is(":visible");

        if (isAscendingAndAboveThreshold && cloudsVisible) {
            toggleClasses(isAscendingAndAboveThreshold);
        } else if (isDescendingAndBelowThreshold && !cloudsVisible) {
            toggleClasses(isAscendingAndAboveThreshold);
        }

        lastTop = top;
    }

    function toggleClasses(isAscending) {
        btn.toggleClass("display-6", !isAscending)
            .toggleClass("h3", isAscending);
        div.toggleClass("display-1", !isAscending)
            .toggleClass("display-6", isAscending);
        header.height(isAscending ? "3em" : "16em")
            .css("background-color", isAscending ? "black" : "transparent");
        clouds.toggle()
            .height(isAscending ? "3em" : "16em")
    }
});