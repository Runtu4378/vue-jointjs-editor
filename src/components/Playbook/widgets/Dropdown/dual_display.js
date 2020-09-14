import Base from './Base'
const itemTemplate = `<li class="item" data-value="<% if (value) { %><%= value %><% } else { %><%= display %><% } %>" data-display="<%= display %>"><% if (value) { %><span><%= value %></span><% } %><%= display %></li>
                     `
const viewTemplate = `<label class="dropdown-title"><%= label %></label>
                      <% if (linked) { %><div class="linked">linked<i class="fa fa-link"></i></div><% } %>
                      <div class="dropdown-input">
                      <div class="dropdown-background"></div>
                      <input type="text" id="<%= field_name %>" class="widget-value" name="<%= field_name %>" value="<%= value %>" placeholder="<%= placeholder %>" autocomplete="off"<% if (disabled) { %> readonly<% } %>/>
                      <i class="fa fa-angle-down toggle-dd"></i>
                      <div class="dropdown-menu">
                      <% if (search) { %><li class="search"><input type="text" class="dropdown-search" placeholder="Search"><i class="fa fa-times-circle clear-search"></i></li><% } %>
                      <div class="scroller-container">
                      <ul class="scroller-content"></ul>
                      <div class="scroller-track">
                      <div class="scroller-handle"></div>
                      </div>
                      </div>
                      </div>
                      </div>
                    `
export default Base.extend({
  className: 'dropdown-widget dual',
  events: {
    'click i.toggle-dd': 'toggle',
    'click input.widget-value': 'toggle',
    'click li.item': 'select',
    'focus input': 'setFocus',
    'blur input': 'clearFocus',
    'mouseover input': 'showTip',
    'mouseout input': 'hideTip'
  },
  initialize: function (t) {
    var e = this
    this.field_name = t.name ? t.name : this.cid, 
    this.label = t.label ? t.label : 'Label', 
    this.value = t.value ? t.value : '', 
    this.placeholder = t.placeholder ? t.placeholder : '', 
    this.freeform = typeof t.freeform === 'boolean' ? t.freeform : true, 
    this.list_data = t.data ? t.data : [], 
    this.action = t.action ? t.action : 'update:dropdown', 
    this.enableTooltip = t.tooltip ? t.tooltip : false, 
    this.openUp = t.openUp ? t.openUp : false, 
    this.template = _.template(viewTemplate), 
    this.itemTmpl = _.template(itemTemplate)
    var o = _.findIndex(this.list_data, function (t) {
      return t.value === e.value
    })
    this.display = o !== -1 ? this.list_data[o].display : this.value, this.search = '', Base.prototype.initialize.apply(this)
  },
  remove: function () {
    Base.prototype.remove.apply(this)
  },
  render: function () {
    var t = this.enabled && this.freeform ? !1 : !0
    return this.$el.html(this.template({
      label: this.label,
      value: '',
      field_name: this.field_name,
      placeholder: this.placeholder,
      open: this.isOpen,
      search: !1,
      disabled: t,
      linked: !1
    })), 
    this.$el.find('input.widget-value').val(this.value), 
    this.$el.attr('cid', this.cid).attr('id', this.field_name + '-widget'), 
    this.openUp && this.$el.addClass('popup'), 
    this.list_data.length > 0 && this.renderList(), 
    this.coa.get('editMode') || this.disable(), this
  },
  renderList: function () {
    var t = this
    this.$el.find('ul').empty()
    var e = ''
    _.each(this.list_data, function (i) {
      var n = ''
      var s = ''
      typeof i === 'object' ? (i.hasOwnProperty('display') && (n = i.display), i.hasOwnProperty('value') && (s = i.value)) : n = i, e += t.itemTmpl({
        display: n,
        value: s
      })
    }), this.$el.find('ul').append(e)
  },
  toggle: function (t) {
    this.setFocus(), this.enabled && (this.isOpen ? this.close() : this.open())
  },
  open: function () {
    this.isOpen = !0, this.$el.addClass('open').removeClass('error'), this.$el.find('.dropdown-menu').slideDown(0), this.enableBodyClick()
  },
  close: function () {
    this.isOpen = !1, this.$el.removeClass('open').removeClass('error'), this.$el.find('.dropdown-menu').slideUp(0), this.disableBodyClick()
  },
  select: function (t) {
    this.value = $(t.currentTarget).data('value'), this.display = $(t.currentTarget).data('display'), this.useDisplay ? $('input.widget-value', this.$el).val($(t.target).text()) : $('input.widget-value', this.$el).val(this.value), this.updateModelData(), this.close()
  },
  updateModelData: function () {
    this.model && this.model.set(this.field_name, this.value), this.action !== '' && this.dispatcher.trigger(this.action, this.value)
  },
  showTip: function (t) {
    if (this.enableTooltip && this.display && !this.tooltip) {
      var e = this.$el.find('input').offset()
      this.tooltip = $('<div/>').addClass('tooltip right').html(this.display).css({
        display: 'none',
        top: e.top - 2,
        left: e.left + this.$el.width() + 10
      }), $('body').append(this.tooltip), this.tooltip.fadeIn(200)
    }
  },
  hideTip: function (t) {
    var e = this
    this.enableTooltip && this.tooltip && this.tooltip.fadeOut(200, function () {
      e.tooltip.remove(), e.tooltip = null
    })
  }
})
