// Store API endpoint as a url object:
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Perform request to target URL
d3.json(url).then(function(data) {
createFeatures(data.features)
});

function createFeatures(earthquakeData) {
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>
      Time of Occurrence: ${new Date(feature.properties.time)}<br>Magnitude: ${feature.properties.mag}`);
  }

  let earthquake = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
      // Determine the size of the circle based on magnitude
      let radius = feature.properties.mag * 8000;

      // Determine the color of the circle based on the sig property
      function getColor(sig) {
        return sig >= 90 ? 'red' :
               sig >= 70 ? 'orange' :
               sig >= 50 ? 'yellow' :
               sig >= 30 ? 'lightgreen' :
               sig >= 10 ? 'green' :
               'darkgreen';
      }

      let color = getColor(feature.properties.sig);

      return L.circle(latlng, {
        radius: radius,
        fillColor: color,
        color: 'black',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.75
      });
    }
  });

  createMap(earthquake);
}


function createMap(earthquake) {
  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
  
  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };
  // Create an overlay object to hold our overlay.
  let overlayMaps = {
  Earthquakes: earthquake
};

  let myMap = L.map("map", {
    center: [40.588, -108.114],
    zoom: 6,
    layers: [street, earthquake]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);  

}