Show [MTB-Lohja](http://www.mtb-lohja.com/) mountain biking locations on a map. Uses [Leaflet.js](http://leafletjs.com/) and [GeoJSON](http://geojson.org/) to show locations. Further instructions and readme in Finnish, as the primary audience of this service is Finnish. 

---------------------- 
[![Code Climate](https://codeclimate.com/github/teelahti/MTB-Lohja-places/badges/gpa.svg)](https://codeclimate.com/github/teelahti/MTB-Lohja-places)

# MTB-Lohjan:n ajomaastot kartalla #

Tämä on sivusto, joka näyttää [MTB-Lohjan](http://www.mtb-lohja.com/) nimetyt kohteet kartalla. Ideana on koota vanhaa perintöä talteen, ja samalla helpottaa uusien pyöräilijöiden porukkaan mukaan sulautumista.  

## Kohteiden lisääminen ##

Kohteita on kolmenlaisia: alueita, polkuja, ja pisteitä. Nämä kaikki kolme vaativat erilaiset paikkatiedot, mutta kaikissa kolmessa on perustiedot sama: otsikko ja tarina. Otsikko on paikan nimi, ja sulussa perässä sen vaihtoehtoiset nimet. Esimerkiksi: 

> Kypäränhalkaisija (jokutoinennimi, jokukolmasnimi)

Paikkatiedot sijaitsevat hakemistossa /app/data, ja niitä voi muokata suoraan tekemällä pull requestin, tai pyytämällä muutosta MTB-Lohjan foorumeilla.

## Kehittäminen ##

Aja `npm install` ja sen jälkeen `gulp` niin saat kehityspalvelimen auki.
