const OverpassLayer = require('overpass-layer')

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
    map.on('mousemove', (e) => {
      if (e) {
        console.log(e.latlng)
      }
    })

    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control-overpass-lens')
    container.innerHTML = '<span>🔍</span>'
    container.title = 'Query map'

    container.onclick = () => {
      this.isShown ? this.hide() : this.show()

      return false
    }

    return container
  },

  show () {
    if (!this.layer) {
      this.layer = new OverpassLayer({
        overpassFrontend: this.overpassFrontend,
        query: 'nwr[building]',
        minZoom: 15,
        feature: {
          title: '{{ tags.name }}',
          style: { width: 1, color: 'black' }
        }
      })
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
