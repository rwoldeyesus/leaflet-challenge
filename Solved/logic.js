// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
tileSize: 512,
maxZoom: 18,
zoomOffset: -1,
id: "mapbox/streets-v11",
accessToken: "pk.eyJ1IjoicndvbGRleWVzdXMiLCJhIjoiY2trcm9wbWM3MGVxejJ4bGo4d3Voc2M4OCJ9.5bQTKZWAKhb5fEgxVMOGzA"
}).addTo(myMap);

function DepthColor(depth) {
  if (depth > 90)
    return 	"#EB391A"
  else if (depth > 70)
    return "#EB7B1A"
  else if (depth > 50)
    return "#EBA51A"
  else if (depth > 30)
    return "#EBDA1A"
  else if (depth > 10)
    return "#B3EB1A"
  else  
    return "#6DEB1A"}




d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {
  console.log(data);
  console.log(data.features[0].geometry.coordinates[1]);
  for (var i = 0; i < data.features.length; i++) {
    L.circle([data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]], {
      fillOpacity: 0.75,
      color: "black",
      fillColor: DepthColor(data.features[i].geometry.coordinates[2]),
      // Setting our circle's radius equal to the output of our markerSize function
      // This will make our marker's size proportionate to its population
      radius: data.features[i].properties.mag*2000
    }).bindPopup("<h1>" +data.features[i].geometry.coordinates[2]+ "</h1> <hr> <h3>Magnitude: " + data.features[i].properties.mag+ "</h3>").addTo(myMap);
  }
  

});
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 30, 50, 70, 90],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + DepthColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);