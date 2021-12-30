var overpassURL = '//overpass-api.de/api/interpreter'
// var overpassURL = 'map.osm' // Download a .osm file to this directory and use this instead
const overpassFrontend = new OverpassFrontend(overpassURL)

const map = L.map('map').setView([51.505, -0.09], 15)

const osm_mapnik = L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }
)
osm_mapnik.addTo(map)

const lens = L.overpassLens(
  {
    radius: 100,
    radiusUnits: 'meters'
  },
  {
    overpassFrontend: overpassFrontend,
    query: 'nwr[building]',
    minZoom: 15,
    feature: {
      title: '{{ tags.name }}',
      style: { width: 1, color: 'black' },
      markerSymbol: ''
    }
  }
)
lens.addTo(map)
