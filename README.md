# leaflet-overpass-lens
On a Leaflet Map, query an area around the mouse pointer for map items via Overpass API (an OpenStreetMap database server)

## Screenshot
![Screenshot of the demo application, showing the configuration on the left side. On the right side a map with buildings and roads intersecting the selected lens.](screenshot.png)

## Usage
You will also need to include the module
[overpass-frontend](https://github.com/plepe/overpass-frontend) which takes
care of the communication with the Overpass API server.

```js
var overpassURL = '//overpass-api.de/api/interpreter'
// var overpassURL = 'map.osm' // Download a .osm file to this directory and use this instead
const overpassFrontend = new OverpassFrontend(overpassURL)

const map = L.map('map').setView([51.505, -0.09], 15)

// you can omit these values; shown are the default values.
const options = {
  position: 'topleft', // position of the control
  continuous: false, // if true, lens will follow mouse and update continuously
  icon: '<span>🔍</span>', // which icon to use on the control
  radius: 100, // radius around the mouse pointer
  radiusUnits: 'meters' // units,
  bufferStyle: { weight: 3, color: '#007fff', fill: false } // the visible buffer around the mouse position
}

// Configure the overlay. For more options, please check https://github.com/plepe/overpass-layer#readme
const layerOptions = {
  overpassFrontend: overpassFrontend,
  query: 'nwr', // load everything in that area
}

L.overpassLens(options, layerOptions).addTo(map)
```
