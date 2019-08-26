/* eslint comma-dangle: ["error", "always-multiline"] */
/* globals $ */

import _bb from 'backbone'
import _lo from 'lodash'
// import $ from 'jquery'

const template = `
<h3>CHOOSE ACTION</h3>
<span class="select-by">
  <span data-mode="actions" class="<% if (mode == 'actions') {%>active<% } else { %>on<% } %>">by Action</span>
  <span data-mode="apps" class="<% if (mode == 'apps') {%>active<% } else { %>on<% } %>"">by App</span>
</span>

`

export default _bb.View.extend({
  className: 'type-nav',
  events: {
    'click .on': 'setMode',
  },
  initialize: function (t) {
    this.template = _lo.template(template)
  },
  render: function () {
    var t = _lo.startsWith(this.coa.get('actionSelectState'), 'action')
      ? 'actions'
      : 'apps'
    this.$el.html(this.template({
      mode: t,
    }))
    return this
  },
  setMode: function (t) {
    var e = $(t.target).data('mode')
    var i = this.coa.get('actionSelectState')
    var n = i
    this.coa.set('actionSelectMode', e)
    if (i !== 'apps' && i !== 'actions') {
      n = e
    } else if (i === 'action_apps') {
      n = 'action_assets'
    } else if (i === 'action_assets') {
      n = 'action_apps'
    }
    if (i !== n) {
      this.coa.set('actionSelectState', n)
      this.dispatcher.trigger('panel:update')
    }
  },
})
