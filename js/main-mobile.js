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
        map.height("100%");
        map.width("100%");
        map.appendTo(".modal-body");
        map.removeClass("rounded-5");
        mapbox.resize();
        //window.dispatchEvent(new Event('resize'));
    });

    $(".btn-close").click(function () {
        map.removeAttr("style");
        map.appendTo("#bottom");
        map.addClass("rounded-5");
        mapbox.resize();
    });

    $(window).scroll(scrollFunction);

    function scrollFunction() {
        let top = main.getBoundingClientRect().top + 256;
        if (top < 200 && top < lastTop) {
            btn.removeClass("display-6")
                .addClass("h3");
            div.removeClass("display-1")
                .addClass("display-6");
            header.height("3em")
                .css("width", "100%")
                .css("background-color", "black");
            clouds.height("3em")
                .hide();
        } else {
            div.removeClass("display-6")
                .addClass("display-1");
            btn.removeClass("h3")
                .addClass("display-6");
            clouds.show()
                .height("16em");
            header.height("16em")
                .css("background-color", "transparent");
        }
        lastTop = top;
    }
});