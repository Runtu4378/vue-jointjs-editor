const template = `
<h5><%- title %></h5>
<% if (count && count >= 0) {%><span class="count">(<%= count %>)</span><% } %>
`

export default Backbone.View.extend({
  className: 'list-header',
  initialize: function () {
    this.template = _.template(template)
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
