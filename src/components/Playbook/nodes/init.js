joint.shapes.basic.PortsModelInterface = {
  initialize: function () {
    this.updatePortsAttrs()
    this.on('change:inPorts change:outPorts', this.updatePortsAttrs, this)
    this.constructor.__super__.constructor.__super__.initialize.apply(this, arguments)
  },
  updatePortsAttrs: function (t) {
    if (this._portSelectors) {
      var e = _.omit(this.get('attrs'), this._portSelectors)
      this.set('attrs', e, {
        silent: true,
      })
    }
    this._portSelectors = []
    const attrSet = {}
    _.each(this.get('inPorts'), (t, e, s) => {
      var o = this.getPortAttrs(t, e, s.length, '.inPorts', 'in')
      this._portSelectors = this._portSelectors.concat(_.keys(o))
      _.extend(attrSet, o)
    })
    _.each(this.get('outPorts'), (t, e, s) => {
      var o = this.getPortAttrs(t, e, s.length, '.outPorts', 'out')
      this._portSelectors = this._portSelectors.concat(_.keys(o))
      _.extend(attrSet, o)
    })
    this.attr(attrSet, {
      silent: true,
    })
    this.processPorts()
    this.trigger('process:ports')
  },
  getPortSelector: function (t) {
    let selector = '.inPorts'
    let idx = this.get('inPorts').indexOf(t)
    if (
      idx < 0 &&
      (
        selector = '.outPorts',
        idx = this.get('outPorts').indexOf(t),
        idx < 0
      )
    ) {
      throw new Error('getPortSelector(): Port doesn\'t exist.')
    }
    return selector + '>g:nth-child(' + (idx + 1) + ')>.port-body'
  },
  hasJoinFunction: function () {
    return this.inCount > 1 ? !0 : !1
  },
  hasCallbackWrapper: function () {
    return this.get('callsback') && this.outbound.length > 1 ? !0 : !1
  },
  getBlockName: function () {
    var t = this.get('name')
    return this.formatName(t)
  },
}

joint.shapes.basic.PortsViewInterface = {
  initialize: function () {
    this.listenTo(this.model, 'process:ports', this.update)
    joint.dia.ElementView.prototype.initialize.apply(this, arguments)
  },
  update: function () {
    this.renderPorts()
    joint.dia.ElementView.prototype.update.apply(this, arguments)
  },
  renderPorts: function () {
    const nodeIn = this.$('.inPorts').empty()
    const nodeOut = this.$('.outPorts').empty()
    const portMarkup = this.model.portMarkup
    const renderFunc = _.template(portMarkup)
    _.each(_.filter(this.model.ports, function (t) {
      return t.type === 'in'
    }), function (port, id) {
      const node = joint.V(renderFunc({
        id: id,
        port: port,
      })).node
      nodeIn.append(node)
    })
    _.each(_.filter(this.model.ports, function (t) {
      return t.type === 'out'
    }), function (port, id) {
      const node = joint.V(renderFunc({
        id: id,
        port: port,
      })).node
      nodeOut.append(node)
    })
  },
}
