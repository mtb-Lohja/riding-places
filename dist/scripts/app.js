(function() {
    'use strict';
    var map = L.map('map', {
        center: [60.22987064, 24.07661212],
        zoom: 12
    });

    L.Icon.Default.imagePath = 'images/';

    L.tileLayer('http://tiles.kartat.kapsi.fi/peruskartta/{z}/{x}/{y}.jpg', {
        attribution: 'Sisältää <a href="http://www.maanmittauslaitos.fi/avoindata_lisenssi_versio1_20120501">Maanmittauslaitoksen Maastotietokannan 06/2012</a> aineistoa'
    }).addTo(map);

    function getJSON(url, successHandler, errorHandler) {
        var xhr = typeof XMLHttpRequest !== 'undefined' ?
            new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        xhr.open('get', url, true);
        xhr.onreadystatechange = function() {
            var status;
            var data;
            // http://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
            if (xhr.readyState === 4) { // `DONE`
                status = xhr.status;
                if (status === 200) {
                    data = JSON.parse(xhr.responseText);

                    if (successHandler) {
                        successHandler(data);
                    }
                } else {
                    if (errorHandler) {
                        errorHandler(status);
                    }
                }
            }
        };
        xhr.send();
    }

    function onEachFeature(feature, layer) {
        if (feature.properties && feature.properties.title) {
            layer.bindPopup('<h4>' + feature.properties.title + '</h4><p>' + feature.properties.description + '</p>');
        }
    }

    getJSON('data/mtb-lohja-locations.geojson.js', function(data) {

        L.geoJson(data, {
            onEachFeature: onEachFeature
        }).addTo(map);

    }, function(status) {
        // TODO: Show error on UI
        console.error('Datan haku epäonnistui.', status);
    });

}());
