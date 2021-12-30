const OverpassLayer = require('overpass-layer')

L.OverpassLens = L.Control.extend({
  options: {
    position: 'topleft'
  },

  initialize: function (overpass, options={}) {
    this.overpass = overpass

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

    container.onclick = function () {
      return false
    }

    return container
  }
})

L.overpassLens = function (overpass, options) {
  return new L.OverpassLens(overpass, options)
}
