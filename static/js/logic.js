// Store API endpoint as a url object:
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Perform request to target URL
d3.json(url).then(function(data) {
createFeatures(data.features)
});

// Determine the color of the circle based on the sig property
function getColor(sig) {
  return sig >= 90 ? 'red' :
     sig >= 70 ? 'orange' :
     sig >= 50 ? 'yellow' :
     sig >= 30 ? 'lightgreen' :
     sig >= 10 ? 'green' :
      'darkgreen';
      }


function createFeatures(earthquakeData) {
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>
      Time of Occurrence: ${new Date(feature.properties.time)}<br>Magnitude: ${feature.properties.mag}`);
  }

  let earthquake = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
      // Determine the size of the circle based on magnitude
      let radius = feature.properties.mag * 7000;

      let color = getColor(feature.properties.sig);

      return L.circle(latlng, {
        radius: radius,
        fillColor: color,
        color: 'black',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.5
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

// Set up the legend using grades and colors arrays
let legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend");
  let grades = [0, 10, 30, 50, 70, 90];
  let colors = ['darkgreen', 'green', 'lightgreen', 'yellow', 'orange', 'red'];
  let labels = [];

  // Add the legend title
  let legendInfo = "<h3>Depth</h3>" +
  "<div class=\"labels\">";
  div.innerHTML = legendInfo;

  // Create legend labels with color boxes
  for (let i = 0; i < grades.length; i++) {
    labels.push(
      '<li style="background-color:' + colors[i] + '"></li> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+')
    );
  }

  div.innerHTML += "<ul>" + labels.join("") + "</ul>";

   // Set background color of legend box to white
   div.style.backgroundColor = 'white';
   
  return div;
};

legend.addTo(myMap);

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);  

}


