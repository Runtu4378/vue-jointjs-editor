const template = `
<label>描述</label>
<div class="description">
  <% if (description && description !== '') { %><%= description %><% } else { %>-<% } %>
</div>
`

export default Backbone.View.extend({
  className: 'action-info',
  initialize: function ({ action }) {
    this.action = action
    this.template = _.template(template)
  },
  render: function () {
    this.$el.html(this.template({
      description: this.action ? this.action.get('description') : null,
    }))
    return this
  },
})
