const template = `
<button type="button" class="btn<% if (style) { %> <%= style %><% } if (options.length > 0) { %> btn-dropdown <% } %>">
  <%= label %>
</button>
<% if (options.length > 0) { %>
    <div class="dropdown-btn <% if (style) { %> <%= style %><% } %>">
    <i class="fa fa-caret-down"></i>
  </div>
  <div class="btn-dropdown-menu hidden">
    <ul class="btn-dropdown-content"></ul>
  </div>
<% } %>
`

export default Backbone.View.extend({
  className: 'button-widget',
  events: {
    'click button': 'buttonClick',
    'click .dropdown-btn': 'toggleMenu',
    'click li': 'optionClick',
  },
  initialize: function (t) {
    this.label = t && t.label ? t.label : ''
    this.action = t && t.action ? t.action : 'button:click'
    this.style = t && t.style ? t.style : ''
    this.options = t && t.options ? t.options : []
    this.testFunc = t && t.options ? t.options : null
    this.template = _.template(template)
    this.isMenuopen = false
    this.enabled = true
  },
  render: function () {
    this.$el.html(this.template({
      label: this.label,
      style: this.style,
      options: this.options,
    }))
    this.options.length > 0 && this.renderList()
    return this
  },

  /// ----以下是自定义方法---
  buttonClick: function (t) {
    t.preventDefault()
    this.enabled && this.dispatcher.trigger(this.action, t.shiftKey)
  },
  optionClick: function (t) {
    t.preventDefault()
    const key = _.findIndex(this.options, {
      id: t.target.id,
    })
    var e = this.options[key]
    this.closeMenu()
    this.dispatcher.trigger(e.action, t.shiftKey)
  },
  toggleMenu: function () {
    this.isMenuopen === !0 ? this.closeMenu() : this.openMenu()
  },
  openMenu: function () {
    this.isMenuopen = !0
    this.$el.find('.btn-dropdown-menu').removeClass('hidden')
  },
  closeMenu: function () {
    this.isMenuopen = !1
    this.$el.find('.btn-dropdown-menu').addClass('hidden')
  },
  renderList: function () {
    this.$el.find('ul').empty()
    var t = ''
    _.each(this.options, function (e) {
      typeof e === 'object' && e.hasOwnProperty('name') && e.hasOwnProperty('id') && (t += '<li id="' + _.escape(e.id) + '">' + _.escape(e.name) + '</li>')
    })
    this.$el.find('ul').append(t)
  },
  enable: function () {
    this.enabled = true
    this.$el.removeClass('disabled')
  },
  disable: function () {
    this.enabled = false
    this.$el.addClass('disabled')
  },
  hide: function () {
    this.enabled = false
    this.$el.hide(0)
  },
  show: function () {
    this.enabled = true
    this.$el.show(0)
  },
})
