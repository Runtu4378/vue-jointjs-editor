import Toggle from '../../../widgets/Toggle'

const template = `
<div class="filter-toggle"><span class="filter-title">Filter on "<%= contains %>"</span></div>
<div class="contains-count">Showing <%= showing %> of <%= total %></div>
`

export default Backbone.View.extend({
  className: 'contains-toggle',
  initialize: function (t) {
    this.template = _.template(template)
    this.toggle = new Toggle({
      label: '',
      model: this.coa,
      field: 'showContains',
    })
    this.showing = t.showing
    this.total = t.total
  },
  render: function () {
    this.toggle && this.toggle.remove()
    this.$el.html(this.template({
      contains: this.model.join(', '),
      showing: this.showing,
      total: this.total,
    }))
    this.$el.find('.filter-toggle').append(this.toggle.render().el)
    return this
  },
  remove: function () {
    this.toggle.remove()
    Backbone.View.prototype.remove.apply(this)
  },
  updateCounts: function (t, e) {
    this.showing = t
    this.total = e
    this.render()
  },
})
