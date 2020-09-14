import RevertContainer from './components/RevertContainer'

export default Backbone.View.extend({
  className: 'panel-wrapper',
  events: {
    'click span.close': 'close',
    'click span.back': 'back',
    'click .settings': 'openConfig',
  },
  initialize: function () {
    this.revert = null
  },
  remove: function () {
    this.unbind()
    this.undelegateEvents()
    this.revert && this.revert.remove()
    Backbone.View.prototype.remove.apply(this)
  },
  close: function () {
    this.dispatcher.trigger('panel:close')
  },
  back: function () {
    this.dispatcher.trigger('panel:back')
  },
  addRevert: function (t) {
    this.revert = new RevertContainer()
    t.append(this.revert.render().el)
  },
  openConfig: function () { },
})
