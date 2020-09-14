const template = `
<%= name %><span>select</span>
`

export default Backbone.View.extend({
  tagName: 'li',
  events: {
    click: 'select',
  },
  initialize: function (t) {
    this.template = t.tmpl
      ? _.template(t.tmpl)
      : _.template(template)
    this.clickEvent = t.clickEvent
      ? t.clickEvent
      : 'scroller:click'
  },
  render: function () {
    this.$el.html(this.template(this.model.toJSON()))
    return this
  },
  select: function () {
    this.dispatcher.trigger(this.clickEvent, this.model)
  },
})
