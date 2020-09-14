const template = `
<label class="dropdown-title"><%= label %></label>
<% if (linked) { %><div class="linked">linked<i class="fa fa-link"></i></div><% } %>
<div class="dropdown-input<% if (selector) { %> selector<% } %>">
  <div class="dropdown-background"></div>
  <input type="text" autocomplete="off" id="<%= field_name %>" name="<%= field_name %>" value="" placeholder="<%= placeholder %>"<% if (maxlength) { %> maxlength="<%= maxlength %>"<% } %>/>
  <% if (selector) { %>
    <i class="fa fa-angle-right"></i>
  <% } %>
</div>
`

export default Backbone.View.extend({
  className: 'plain-input-widget',
  events: {
    'click .fa': 'toggleSelector',
    'click input': 'inputClick',
    'change input': 'updateValue',
    'mouseover input': 'showTip',
    'mouseout input': 'hideTip',
  },
  initialize: function (config) {
    const {
      name,
      label = 'Label',
      value = '',
      placeholder = '',
      linked, tooltip,
      action = '',
      data = [],
      filter = '',
      filtered = [],
      maxlength = '',
      replaceFilter = [],
    } = config

    this.template = _.template(template)

    this.field_name = name || this.cid
    this.label = label
    this.value = value
    this.placeholder = placeholder
    this.linked = linked || false
    this.enableTooltip = tooltip || false
    this.action = action
    this.data = data
    this.filtered = filtered
    this.selector = this.data.length > 0
    this.enableTooltip = tooltip || false
    this.maxlength = maxlength
    this.filter = filter
    this.enabled = true
    this.timer = null
    this.replaceFilter = replaceFilter

    this.listenTo(this.coa, 'change:editMode', this.editModeChange)
  },
  remove: function () {
    this.updateValue()
    Backbone.View.prototype.remove.apply(this)
  },
  render: function () {
    this.$el.html(this.template({
      label: this.label,
      field_name: this.field_name,
      placeholder: this.placeholder,
      linked: this.linked,
      selector: this.selector,
      maxlength: this.maxlength,
    }))
    this.$el.find('input').val(this.value)
    this.$el.attr('cid', this.cid)
    this.coa.get('editMode') || this.disable()
    return this
  },
  editModeChange: function (t, e) {
    e ? this.enable() : this.disable()
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
  updateValue: function () {
    var t = $('input', this.$el).val()
    this.value = this.checkValue(t)
    this.value !== t && $('input', this.$el).val(this.value)
    this.model && this.model.set(this.field_name, this.value)
    this.action !== '' && this.dispatcher.trigger(this.action, this.value)
  },
  setValue: function (t) {
    t = this.checkValue(t)
    $('input', this.$el).val(t)
    this.updateValue()
  },
  toggleSelector: function (t) {
    this.$el.removeClass('warn')
    this.data.length > 0 && this.enabled && this.dispatcher.trigger('select:toggle', this)
  },
  checkValue: function (t) {
    if (
      this.maxlength &&
      t.length > this.maxlength
    ) {
      t = t.substring(0, this.maxlength)
    }
    if (this.filter && this.replaceFilter.length === 0) {
      const e = new RegExp(this.filter)
      t = t.replace(e, '')
    } else if (this.filter && this.replaceFilter.length > 0) {
      const e = new RegExp(this.filter)
      this.replaceFilter.forEach(function (e) {
        t = t.replace(e[0], e[1])
      })
      t = t.replace(e, '')
    }
    return t
  },
  inputClick: function () {
    if (this.enabled) {
      this.$el.removeClass('warn')
      this.data.length > 0 && this.dispatcher.trigger('select:toggle', this)
    }
  },
  showTip: function (t) {
    var e = this
    var i = this.$el.find('input').val()
    if (
      this.enableTooltip &&
      i.trim() !== '' &&
      !this.tooltip
    ) {
      this.timer = setTimeout(function () {
        var t = e.$el.find('input').offset()
        e.tooltip = $('<div/>').addClass('tooltip right').text(i).css({
          display: 'none',
          top: t.top - 2,
          left: t.left + e.$el.width() + 10,
        })
        $('body').append(e.tooltip)
        e.tooltip.fadeIn(200)
      }, 500)
    }
  },
  hideTip: function (t) {
    clearTimeout(this.timer)
    if (this.enableTooltip && this.tooltip) {
      this.tooltip.fadeOut(200, () => {
        this.tooltip.remove()
        this.tooltip = null
      })
    }
  },
})
