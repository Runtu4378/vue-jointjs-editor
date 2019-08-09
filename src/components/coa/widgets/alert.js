/* eslint comma-dangle: ["error", "always-multiline"] */

import $ from 'jquery'
import _ from 'underscore'
import _backbone from 'backbone'

export const template = `
<div class="modal-overlay"></div>
<div class="alert <% if (modalClass) { %> <%= modalClass %><% } %>">
  <h2><%= title %></h2>
  <p><%= message %></p>
  <%= customHTML %>
  <div class="controls">
    <% if (!confirmOnly) { %>
        <div class="cancel btn btn-secondary"><span><%= cancel %></span></div>
    <% } %>
      <div class="confirm btn btn-primary"><%= confirm %></div>
  </div>
</div>
`

export const view = _backbone.View.extend({
  className: 'modal',
  events: {
    'click .confirm': 'confirmAction',
    'click .cancel': 'cancelAction',
    'click': 'modalClick',
  },
  initialize: function (t, e) {
    this.content = {
      title: 'Alert!',
      message: 'Default alert message',
      confirm: 'Delete',
      cancel: 'Cancel',
      customHTML: '',
      modalClass: '',
      confirmOnly: false,
    }
    $.extend(this.content, t)

    this.closeAfterConfirm = e && e.hasOwnProperty('closeAfterConfirm')
      ? e.closeAfterConfirm
      : true
    this.callback = e && e.callback
      ? e.callback
      : this.confirmDefault
    this.cancel = e && e.cancel
      ? e.cancel
      : null
    this.data = e && e.data
      ? e.data
      : true
    this.responseRequired = e && e.responseRequired
      ? e.responseRequired
      : false
    this.template = _.template(template)
    this.render()
  },
  remove: function () {
    this.callback = this.confirmDefault
    this.data = !0
    _backbone.View.prototype.remove.apply(this)
  },
  render: function () {
    $('body').append(this.$el.html(this.template(this.content)))
    return this
  },
  confirmDefault: function () {
    this.closeAfterConfirm && this.remove()
  },
  confirmAction: function () {
    this.callback && this.callback(this.data)
    this.closeAfterConfirm && this.remove()
  },
  cancelAction: function () {
    this.cancel && this.callback(false)
    this.remove()
  },
  modalClick: function (t) {
    if (t) {
      var e = $(t.target).closest('.alert')
      e.length || this.responseRequired || this.cancelAction()
    }
  },
})
