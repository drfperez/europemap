

	
var map = L.map('map', '', {
mousewheel: false
});


L.tileLayer(
"https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}@2x.png" // stamen toner tiles
).addTo(map);

map.scrollWheelZoom.disable();


// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>% de plàstics reciclats en un any</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.measlesrate + ' de residus de plàstics reciclats al any'
        : 'Coloca el cursor sobre un país');
};

info.addTo(map);


// get color depending on population density value
function getColor(d) {
    return d > 70  ? '#003300' :
            d > 60  ? '#006600' :
            d > 50   ? '#009900' :
            d > 40   ? '#00CC00' :
            d > 30   ? '#00FF00' :
            d < 30   ? '#66FF66' :
                       '#66FF66';
}




function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.measlesrate)
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

geojson = L.geoJson(countriesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

map.attributionControl.addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>. Measles data &copy; <a href="https://www.who.int/immunization/monitoring_surveillance/burden/vpd/surveillance_type/active/measles_monthlydata/en/">World Health Organization</a>');


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'legend'),
        grades = [0, 30, 40, 50, 60, 70],
        labels = [],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);

//storymap

var places = { type: 'FeatureCollection', features: [
{ geometry: { type: "Point", coordinates: [13.12960000, 52.50110000] },
properties: { id: "cover", zoom: 4 }, type: 'Feature' },
{ geometry: { type: "Point", coordinates: [31.15591514, 48.51830379] },
properties: { id: "ukraine", zoom: 6 }, type: 'Feature' },
{ geometry: { type: "Point", coordinates: [22.07571203, 47.51424049] },
properties: { id: "aldgate", zoom: 6 }, type: 'Feature' },
{ geometry: { type: "Point", coordinates: [3, 47] },
properties: { id: "london-bridge", zoom: 6 }, type: 'Feature' },
{ geometry: { type: "Point", coordinates: [-0.5, 54] },
properties: { id: "woolwich", zoom:6 }, type: 'Feature' },
{ geometry: { type: "Point", coordinates: [13.12960000, 52.50110000] },
properties: { id: "gloucester", zoom: 4 }, type: 'Feature' },
{ geometry: { type: "Point", coordinates: [-0.19684993, 51.5033856] },
properties: { id: "caulfield-gardens" }, type: 'Feature' },
{ geometry: { type: "Point", coordinates: [-0.10669358, 51.51433123] },
properties: { id: "telegraph" }, type: 'Feature' },
{ geometry: { type: "Point", coordinates: [-0.12416858, 51.50779757] },
properties: { id: "charing-cross" }, type: 'Feature' }
]};




var placesLayer = L.geoJson(places).addTo(map);

//set opacity of markers to 0
placesLayer.eachLayer(function(layer) {
layer.setOpacity(0);
});


//goodtohere

// Ahead of time, select the elements we'll need -
// the narrative container and the individual sections
var narrative = document.getElementById('narrative'),
sections = narrative.getElementsByTagName('section'),
currentId = '';

setId('cover');

function setId(newId) {
// If the ID hasn't actually changed, don't do anything
if (newId === currentId) return;
// Otherwise, iterate through layers, setting the current
// marker to a different color and zooming to it.
placesLayer.eachLayer(function(layer) {
    if (layer.feature.properties.id === newId) {
        map.setView(layer.getLatLng(), layer.feature.properties.zoom || 14);   
        
    } else {
        
    }
});
// highlight the current section
for (var i = 0; i < sections.length; i++) {
    sections[i].className = sections[i].id === newId ? 'active' : '';
}
// And then set the new id as the current one,
// so that we know to do nothing at the beginning
// of this function if it hasn't changed between calls
currentId = newId;
}

// If you were to do this for real, you would want to use
// something like underscore's _.debounce function to prevent this
// call from firing constantly.
narrative.onscroll = function(e) {
var narrativeHeight = narrative.offsetHeight;
var newId = currentId;
// Find the section that's currently scrolled-to.
// We iterate backwards here so that we find the topmost one.
for (var i = sections.length - 1; i >= 0; i--) {
    var rect = sections[i].getBoundingClientRect();
    if (rect.top >= 0 && rect.top <= narrativeHeight) {
        newId = sections[i].id;
    }
};
setId(newId);
};



function newStyle(){
 geojson.eachLayer(function (layer) {  
if(layer.feature.properties.name == 'Ukraine') {    
layer.setStyle({weight: 5,
        color: '#666',
        dashArray: '',}) 
}
});
}
function oldStyle(){
 geojson.eachLayer(function (layer) {  
if(layer.feature.properties.name == 'Ukraine') {    
layer.setStyle({weight: 2,
        
        color: 'white',
        dashArray: '3',}) 
}
});
}

function germannewStyle(){
 geojson.eachLayer(function (layer) {  
if(layer.feature.properties.name == 'Germany') {    
layer.setStyle({weight: 5,
        color: '#666',
        dashArray: '',}) 
}
});
}
function germanoldStyle(){
 geojson.eachLayer(function (layer) {  
if(layer.feature.properties.name == 'Germany') {    
layer.setStyle({weight: 2,
        color: 'white',
        dashArray: '3',}) 
}
});
}	

function kosovonewStyle(){
 geojson.eachLayer(function (layer) {  
if(layer.feature.properties.name == 'Kosovo') {    
layer.setStyle({weight: 5,
        color: '#666',
        dashArray: '',}) 
}
});
}
function kosovooldStyle(){
 geojson.eachLayer(function (layer) {  
if(layer.feature.properties.name == 'Kosovo') {    
layer.setStyle({weight: 2,
        color: 'white',
        dashArray: '3',}) 
}
});
}	

function overHundred(){
geojson.eachLayer(function (layer) {  
if(layer.feature.properties.name != 'Ukraine' && layer.feature.properties.name != 'Serbia' && layer.feature.properties.name != 'Slovakia' && layer.feature.properties.name != 'Albania' && layer.feature.properties.name != 'Montenegro' && layer.feature.properties.name != 'Greece') {    
layer.setStyle({fillOpacity: 0, opacity: 0}) 
}

});

}

function overHundredout(){
geojson.eachLayer(function (layer) {  

if(layer.feature.properties.name != 'Ukraine') {    
layer.setStyle({fillOpacity: 0.7, opacity: 1}) 
}

});

}  

function overFifty(){
geojson.eachLayer(function (layer) {  
if(layer.feature.properties.name != 'Ukraine' && layer.feature.properties.name != 'Serbia' && layer.feature.properties.name != 'Slovakia' && layer.feature.properties.name != 'Albania' && layer.feature.properties.name != 'Montenegro' && layer.feature.properties.name != 'Greece' && layer.feature.properties.name != 'Romania' && layer.feature.properties.name != 'Moldova') {    
layer.setStyle({fillOpacity: 0, opacity: 0}) 
}

});

}

function overFiftyout(){
geojson.eachLayer(function (layer) {  

if(layer.feature.properties.name != 'Ukraine') {    
layer.setStyle({fillOpacity: 0.7, opacity: 1}) 
}

});

}  





