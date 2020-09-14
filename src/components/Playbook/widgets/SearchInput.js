import EditMode from './mixins/EditMode'

const template = `<i class="fa fa-search"></i>
<input type="text" class="search" placeholder="<%= placeholder %>">
`

export default Backbone.View.extend(_.extend({}, EditMode, {
  className: 'search-input-widget',
  initialize: function (t) {
    this.placeholder = t.placeholder
    this.search = t.search
    this.template = _.template(template)
    this.initEditMode()
  },
  render: function () {
    this.$el.html(this.template({
      placeholder: this.placeholder,
    }))
    this.$el.find('input').val(this.search)
    this.setEditMode()
    return this
  },
}))
