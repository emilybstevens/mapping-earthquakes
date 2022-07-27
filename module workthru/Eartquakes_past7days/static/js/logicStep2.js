
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

//map 
let map = L.map("mapid", {
  center: [
    39.5, -98.5
      ],
  zoom: 3,
  layers: [streets]
});

// layers into layers control, add control to map
L.control.layers(baseMaps).addTo(map);


// style for lines
function styleInfo(feature){
  return {
    opacity: 1,
    fillOpacity: 0.7,
    fillColor: "#EAB623",
    color: "#00000",
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
    
  })
.addTo(map);
});
