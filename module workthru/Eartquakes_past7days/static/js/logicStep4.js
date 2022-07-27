// streets tile
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

//satellite tile
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

//base layer w both tiles
let baseMaps = {
  "Streets": streets,
  "Satellite": satelliteStreets
};

// Create the earthquake layer for our map.
let earthquakes = new L.layerGroup();

// We define an object that contains the overlays.
// This overlay will be visible all the time.
let overlays = {
  Earthquakes: earthquakes
};



//map 
let map = L.map("mapid", {
  center: [
    39.5, -98.5
      ],
  zoom: 3,
  layers: [streets]
});

// Then we add a control to the map that will allow the user to change
// which layers are visible.
L.control.layers(baseMaps, overlays).addTo(map);

// layers into layers control, add control to map
// L.control.layers(baseMaps).addTo(map);


// style for lines
function styleInfo(feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.properties.mag),
    color: "#000000",
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
  };
}

function getRadius(magnitude){
  if (magnitude === 0){
    return 1;
  }
  return magnitude * 4;
}

// This function determines the color of the circle based on the magnitude of the earthquake.
function getColor(magnitude) {
  if (magnitude > 5) {
    return "#ea2c2c";
  }
  if (magnitude > 4) {
    return "#ea822c";
  }
  if (magnitude > 3) {
    return "#ee9c00";
  }
  if (magnitude > 2) {
    return "#eecc00";
  }
  if (magnitude > 1) {
    return "#d4ee00";
  }
  return "#98ee00";
}

// d3.json method w .then() promise and anon function()
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data){
  // geojson leaf
  L.geoJSON(data, {
    // ptl for circle marker on each 
    pointToLayer: function(feature, latlng){
      console.log(data);
      return L.circleMarker(latlng);
    },
    // style
    style: styleInfo,
    // popup
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(earthquakes);

  earthquakes.addTo(map)
});

// Create a legend control object.
let legend = L.control({
  position: 'bottomright'
});

legend.onAdd = function () {

    let div = L.DomUtil.create('div', 'info legend');
        const magnitudes = [0,1,2,3,4,5];
        const colors = [  "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitudes.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);

