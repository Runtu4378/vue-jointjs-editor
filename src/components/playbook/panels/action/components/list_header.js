/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'
import _lo from 'lodash'

const template = `<h5><%- title %></h5><% if (count >= 0) {%><span class="count">(<%= count %>)</span><% } %>
`

export default _bb.View.extend({
  className: 'list-header',
  initialize: function () {
    this.template = _lo.template(template)
    this.title = ''
    this.count = false
  },
  render: function () {
    this.$el.html(this.template({
      title: this.title,
      count: this.count,
    }))
    return this
  },
})
