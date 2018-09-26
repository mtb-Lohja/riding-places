(function() {
    "use strict";
    var map = L.map("map", {
        center: [60.22987064, 24.07661212],
        zoom: 12
    });

    L.tileLayer("http://tiles.kartat.kapsi.fi/peruskartta/{z}/{x}/{y}.jpg", {
        attribution:
            "Sisältää <a href='http://www.maanmittauslaitos.fi/avoindata_lisenssi_versio1_20120501'>Maanmittauslaitoksen Maastotietokannan 06/2012</a> aineistoa"
    }).addTo(map);

    fetch(new Request("data/mtb-lohja-locations.geojson.js"))
        .then(resp => resp.text())
        .then(JSON.parse)
        .then(json => {
            L.geoJson(json, {
                onEachFeature: (feature, layer) => {
                    if (feature.properties && feature.properties.title) {
                        layer.bindPopup(
                            "<h4>" +
                                feature.properties.title +
                                "</h4><p>" +
                                feature.properties.description +
                                "</p>"
                        );
                    }
                }
            }).addTo(map);
        })
        .catch(err => {
            // TODO: Show error on UI
            console.error("Datan haku epäonnistui.", err);
        });
})();
