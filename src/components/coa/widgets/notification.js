/* eslint comma-dangle: ["error", "always-multiline"] */

import $ from 'jquery'
import _ from 'underscore'
import _backbone from 'backbone'

export const template = '<%= message %><span class="close"></span>\n'

export const view = _backbone.View.extend({
  className: 'message',
  events: {
    'click .close': 'close',
  },
  initialize: function (t) {
    this.data = t || {
      message: 'Default notification message',
      autoHide: true,
      showClose: true,
    }
    this.timeout = this.data.timeout ? this.data.timeout : 5
    this.template = _.template(template)
    this.listenTo(this.dispatcher, 'notification:clear', this.close)
    this.timer = null
    this.render()
  },
  render: function () {
    $('#notifications').prepend(this.$el.html(this.template(this.data)))
    if (this.data.autoHide) {
      this.timer = setTimeout(_.bind(this.close, this), 1e3 * this.timeout)
    }
    if (this.data.type) {
      this.$el.addClass(this.data.type)
    }
    return this
  },
  close: function () {
    var t = this
    this.timeout = null
    this.$el.fadeOut(200, function () {
      t.remove()
    })
  },
})
