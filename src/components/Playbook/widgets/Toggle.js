const template = `
<label class="toggle-title"><%= label %></label>
<div class="toggle">
  <input type="checkbox" name="toggle-<%= name %>" class="toggle-checkbox" id="toggle-<%= name %>"<% if (checked) { %> checked<% } %>>
  <label class="toggle-label" for="toggle-<%= name %>"></label>
</div>
`

export default Backbone.View.extend({
  className: 'toggle-wrapper',
  events: {
    'change input': 'toggle',
  },
  initialize: function (t) {
    this.label = t.label
    this.field = t.field
    this.enabled = true
    this.template = _.template(template)
  },
  render: function () {
    this.$el.html(this.template({
      label: this.label,
      name: this.field,
      checked: !!this.model.get(this.field),
    }))
    return this
  },

  enable: function () {
    this.enabled = true
    this.$el.removeClass('disabled')
    this.$el.find('input').removeAttr('disabled')
  },
  disable: function () {
    this.enabled = false
    this.$el.addClass('disabled')
    this.$el.find('input').attr('disabled', 'disabled')
  },
  toggle: function () {
    if (this.enabled) {
      var t = !!this.$el.find('input:checked').length
      this.model.set(this.field, t)
    }
  },
  handleClick: function () {
    if (this.enabled) {
      var t = this.$el.find('input')
      t.prop('checked', !t.prop('checked'))
    }
  },
})
