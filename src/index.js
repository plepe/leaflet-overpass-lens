const OverpassLayer = require('overpass-layer')
const turf = {
  buffer: require('@turf/buffer').default
}

const defaultOptions = {
  position: 'topleft',
  continuous: false,
  icon: '<span>🔍</span>',
  radius: 100,
  radiusUnits: 'meters',
  bufferStyle: { weight: 3, color: '#007fff', fill: false }
}

L.OverpassLens = L.Control.extend({
  initialize: function (options={}, layerOptions={}) {
    this.layerOptions = layerOptions

    this.options = defaultOptions
    L.setOptions(this, options)
    L.Control.prototype.initialize.call(this, options)
  },

  onAdd: function (map) {
    this.map = map

    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control-overpass-lens')
    const containerLink = document.createElement('a')
    containerLink.href = '#'
    containerLink.innerHTML = this.options.icon
    containerLink.title = 'Query map'
    container.appendChild(containerLink)
    this.container = container

    this.map.on('mousemove', (e) => {
      if (e && this.options.continuous) {
        this.position = e.latlng

        if (this.isShown) {
          const geom = this.geometry(e.latlng)
          this.layer.setBounds(geom)

          this.buffer.clearLayers()
          this.buffer.addData(geom)
        }
      }
    })

    containerLink.onclick = () => {
      if (this.isShown) {
        return this.hide()
      }

      setTimeout(() => {
        if (this.options.continuous) {
          this.show()
        } else {
          const origCursor = this.map._container.style.cursor
          this.map._container.style.cursor = 'help'
          container.classList.add('enabled')

          this.map.once('click', (e) => {
            this.map._container.style.cursor = origCursor

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
    this.container.classList.remove('enabled')
    this.container.classList.add('active')

    const geom = this.geometry(this.position)

    if (!this.layer) {
      this.layerOptions.bounds = geom
      this.layer = new OverpassLayer(this.layerOptions)

      this.buffer = L.geoJSON(geom, this.options.bufferStyle)
    } else {
      this.layer.setBounds(geom)

      this.buffer.clearLayers()
      this.buffer.addData(geom)
    }

    this.buffer.addTo(this.map)
    this.layer.addTo(this.map)
    this.isShown = true
  },

  updateOptions (options, layerOptions) {
    this.options = defaultOptions
    L.setOptions(this, options)
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
    this.container.classList.remove('enabled')
    this.container.classList.remove('active')

    this.layer.remove()
    this.buffer.remove()
    this.isShown = false
  }
})

L.overpassLens = function (overpass, options) {
  return new L.OverpassLens(overpass, options)
}
