export default Backbone.Collection.extend({
  comparator: 'order',
  initialize: function () {
    this.lastActive = null
    this.on('change:active', this.setLastActive, this)
  },

  getActive: function () {
    return this.findWhere({
      active: true,
    })
  },
  getActiveId: function () {
    var t = this.findWhere({
      active: true,
    })
    return t ? t.id : null
  },
  getByName: function (name) {
    return this.findWhere({
      name,
    })
  },
  clearFilterCollects: function () {
    var t = this.where({
      type: 'coa.Filter',
    })
    _.each(t, function (t) {
      t.filter_params = {}
    })
  },
  clearFilterParams: function () {
    var t = this.where({
      type: 'coa.Action',
    })
    _.each(t, function (t) {
      t.filter_params = {}
    })
  },
  setLastActive: function (t, e) {
    e && (this.lastActive = t)
  },
})
