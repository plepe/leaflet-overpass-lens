const OverpassLayer = require('overpass-layer')
const turf = {
  buffer: require('@turf/buffer').default
}

L.OverpassLens = L.Control.extend({
  options: {
    position: 'topleft'
  },

  initialize: function (overpassFrontend, options={}) {
    this.overpassFrontend = overpassFrontend

    L.Control.prototype.initialize.call(this, options)
    L.setOptions(this, options)
  },

  onAdd: function (map) {
    this.map = map

    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control-overpass-lens')
    container.innerHTML = '<span>🔍</span>'
    container.title = 'Query map'

    container.onclick = () => {
      if (this.isShown) {
        return this.hide()
      }

      setTimeout(() => {
        this.map.once('click', (e) => {
          this.position = e.latlng
          this.show()
        })
      }, 0)

      return false
    }

    return container
  },

  geometry (position) {
    return turf.buffer({
      type:'Feature',
      geometry: {
        type: 'Point',
        coordinates: [ position.lng, position.lat ]
      }
    }, 200, {units: 'meters'})
  },

  show () {
    if (!this.layer) {
      this.layer = new OverpassLayer({
        overpassFrontend: this.overpassFrontend,
        bounds: this.geometry(this.position),
        query: 'nwr[building]',
        minZoom: 15,
        feature: {
          title: '{{ tags.name }}',
          style: { width: 1, color: 'black' },
          markerSymbol: ''
        }
      })
    } else {
      this.layer.setBounds(this.geometry(this.position))
    }

    this.layer.addTo(this.map)
    this.isShown = true
  },

  hide () {
    this.layer.remove()
    this.isShown = false
  }
})

L.overpassLens = function (overpass, options) {
  return new L.OverpassLens(overpass, options)
}
