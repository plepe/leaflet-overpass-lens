const OverpassLayer = require('overpass-layer')
const turf = {
  buffer: require('@turf/buffer').default
}

const defaultOptions = {
  position: 'topleft',
  continuous: false,
  radius: 100,
  radiusUnits: 'meters'
}

L.OverpassLens = L.Control.extend({
  initialize: function (options={}, layerOptions={}) {
    this.layerOptions = layerOptions

    L.Control.prototype.initialize.call(this, options)
    L.setOptions(this, defaultOptions)
  },

  onAdd: function (map) {
    this.map = map

    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control-overpass-lens')
    container.innerHTML = '<span>🔍</span>'
    container.title = 'Query map'

    this.map.on('mousemove', (e) => {
      if (e && this.options.continuous) {
        this.position = e.latlng

        if (this.isShown) {
          this.layer.setBounds(this.geometry(e.latlng))
        }
      }
    })

    container.onclick = () => {
      if (this.isShown) {
        return this.hide()
      }

      setTimeout(() => {
        if (this.options.continuous) {
          this.show()
        } else {
          this.map.once('click', (e) => {
            this.position = e.latlng
            this.show()
          })
        }
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
    }, this.options.radius || 200, {units: this.options.radiusUnits || 'meters'})
  },

  show () {
    if (!this.layer) {
      this.layerOptions.bounds = this.geometry(this.position)

      this.layer = new OverpassLayer(this.layerOptions)
    } else {
      this.layer.setBounds(this.geometry(this.position))
    }

    this.layer.addTo(this.map)
    this.isShown = true
  },

  updateOptions (options, layerOptions) {
    this.options = options
    L.setOptions(this, defaultOptions)
    this.layerOptions = layerOptions

    if (this.isShown) {
      this.hide()
      this.layer = null
      this.show()
    } else {
      this.layer = null
    }
  },

  hide () {
    this.layer.remove()
    this.isShown = false
  }
})

L.overpassLens = function (overpass, options) {
  return new L.OverpassLens(overpass, options)
}
