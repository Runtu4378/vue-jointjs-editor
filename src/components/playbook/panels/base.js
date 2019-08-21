/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'

import RevertContainer from './components/revertContainer'

export default _bb.View.extend({
  className: 'panel-wrapper',
  events: {
    'click span.close': 'close',
    'click span.back': 'back',
    'click .settings': 'openConfig',
  },
  initialize: function () {
    this.revert = null
    this.listenTo(this.model, 'change:custom_name', this.updateTitle)
  },
  remove: function () {
    this.unbind()
    this.undelegateEvents()
    this.revert && this.revert.remove()
    _bb.View.prototype.remove.apply(this)
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
  openConfig: function () {},
  updateTitle: function (t, e) {
    this.$el.find('.panel-title').html(this.model.getDisplayName())
  },
})
