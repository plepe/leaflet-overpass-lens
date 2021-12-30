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

let lens

function start () {
  const options = {
    radius: 100,
    radiusUnits: 'meters'
  }

  const layerOptions = {
    overpassFrontend: overpassFrontend,
    query: 'nwr',
    minZoom: 15,
    feature: {
      body: '',
      feature: {
        style: {}
      },
      markerSymbol: ''
    }
  }

  const form = document.getElementById('options')
  Array.from(form.elements).forEach(el => {
    const path = el.name.split('.')

    if (path[0] === 'options') {
      options[path[1]] = el.value
    } else if (path[0] === 'layerOptions') {
      if (path.length === 4) {
        if (!layerOptions[path[1]][path[2]]) {
          layerOptions[path[1]][path[2]] = {}
        }
        if (!layerOptions[path[1]][path[2]][path[3]]) {
          layerOptions[path[1]][path[2]][path[3]] = {}
        }

        layerOptions[path[1]][path[2]][path[3]] = el.value
      } else if (path.length === 3) {
        if (!layerOptions[path[1]][path[2]]) {
          layerOptions[path[1]][path[2]] = {}
        }

        layerOptions[path[1]][path[2]] = el.value
      } else {
        layerOptions[path[1]] = el.value
      }
    }
  })

  if (lens) {
    lens.updateOptions(options, layerOptions)
  } else {
    lens = L.overpassLens(options, layerOptions)
    lens.addTo(map)
  }
}

function change () {
  start()
}

function init () {
  const form = document.getElementById('options')
  Array.from(form.elements).forEach(el => el.onchange = () => change())

  start()
}

init()
