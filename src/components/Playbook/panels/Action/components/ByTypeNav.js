const template = `
<h3>选择App</h3>
`

export default Backbone.View.extend({
  className: 'type-nav',
  initialize: function (t) {
    this.template = _.template(template)
  },
  render: function () {
    this.$el.html(this.template())
    return this
  },
})
