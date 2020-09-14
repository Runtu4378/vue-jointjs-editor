const template = `
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

export default Backbone.View.extend({
  className: 'modal',
  events: {
    'click .confirm': 'confirmAction',
    'click .cancel': 'cancelAction',
    'click': 'modalClick',
  },
  initialize: function (content, config) {
    this.content = {
      title: 'Alert!',
      message: 'Default alert message',
      confirm: 'Delete',
      cancel: 'Cancel',
      customHTML: '',
      modalClass: '',
      confirmOnly: false,
    }
    $.extend(this.content, content)
    this.closeAfterConfirm = config && config.hasOwnProperty('closeAfterConfirm')
      ? config.closeAfterConfirm
      : true
    this.callback = config && config.callback
      ? config.callback
      : this.confirmDefault
    this.cancel = config && config.cancel
      ? config.cancel
      : null
    this.data = config && config.data
      ? config.data
      : !0
    this.responseRequired = config && config.responseRequired
      ? config.responseRequired
      : !1
    this.template = _.template(template)
    this.render()
  },
  render: function () {
    $(`#${this.COA_CONTAINER_ID}`).append(this.$el.html(this.template(this.content)))
    return this
  },
  remove: function () {
    this.callback = this.confirmDefault
    this.data = true
    Backbone.View.prototype.remove.apply(this)
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
