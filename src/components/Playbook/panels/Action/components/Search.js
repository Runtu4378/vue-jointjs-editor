import SearchInput from '../../../widgets/SearchInput'

export default Backbone.View.extend({
  className: 'list-search',
  events: {
    keyup: 'update',
  },
  initialize: function (t) {
    this.event = t.event
      ? t.event
      : 'search:list'
    this.placeholder = t.placeholder
      ? t.placeholder
      : 'Search'
    this.search = new SearchInput({
      placeholder: this.placeholder,
    })
  },
  remove: function () {
    this.search.remove()
    Backbone.View.prototype.remove.apply(this)
  },
  render: function () {
    this.$el.append(this.search.render().el)
    return this
  },
  update: function (t) {
    this.dispatcher.trigger(this.event, this.$el.find('input.search').val())
  },
})
