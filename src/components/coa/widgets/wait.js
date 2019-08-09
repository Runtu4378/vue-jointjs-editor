/* eslint comma-dangle: ["error", "always-multiline"] */

import $ from 'jquery'
import _ from 'underscore'
import _backbone from 'backbone'

export const template = `
<div class="message">
  <%= message %> <div class="loader"></div>
</div>
`

export const view = _backbone.View.extend({
  className: 'modal',
  initialize: function (t) {
    this.message = t && t.message
      ? t.message
      : ''
    this.template = _.template(template)
    this.render()
  },
  render: function () {
    $('body').append(this.$el.html(this.template({
      message: this.message,
    })))
  },
})
