import Base from './Base'

const template = `
<label class="dropdown-title"><%= label %></label>
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
  className: 'dropdown-widget',
  events: {
    'click i.toggle-dd': 'toggle',
    'click i.clear-search': 'clearSearch',
    'click input.widget-value': 'toggle',
    'click li.item': 'select',
    'blur input.widget-value': 'updateValue',
    'keypress input.widget-value': 'checkDisabled',
    'keyup input.dropdown-search': 'doSearch',
    'wheel': 'handleWheel',
    'mouseover input': 'showTip',
    'mouseout input': 'hideTip',
    'focus input': 'setFocus',
    'blur input': 'clearFocus',
  },
  initialize: function ({
    name,
    label = 'Label',
    value = '',
    placeholder = '',
    freeform,
    data = [],
    action = 'update:dropdown',
    linked = false,
    tooltip = false,
    presentation = false,
    reverseDisable = false,
    showFullValue = false,
    container = false,
  }) {
    Base.prototype.initialize.apply(this)

    this.field_name = name || this.cid
    this.label = label
    this.value = value
    this.placeholder = placeholder
    this.freeform = typeof freeform === 'boolean' ? freeform : true
    this.list_data = data
    this.action = action
    this.linked = linked
    this.enableTooltip = tooltip
    this.useDisplay = presentation
    this.reverseDisable = reverseDisable
    this.showFullValue = showFullValue
    this.container = container

    this.search = ''
    this.template = _.template(template)
  },
  remove: function () {
    this.$handle && this.$handle.draggable().off("drag")
  },
  render: function () {
    var t = this.list_data.length > 9 ? true : false
    var e = !this.enabled || this.enabled && !this.freeform ? true : false

    this.$el.html(this.template({
      label: this.label,
      value: "",
      field_name: this.field_name,
      placeholder: this.placeholder,
      open: this.isOpen,
      search: t,
      linked: this.linked,
      disabled: e
    }))
    this.$el.find("input.widget-value").val(this.value)
    this.$el.attr("cid", this.cid).attr("id", this.field_name + "-widget")

    this.$track = this.$el.find(".scroller-track")
    this.$handle = this.$el.find(".scroller-handle")
    this.$content = this.$el.find(".scroller-content")

    this.$handle.draggable({
      containment: "parent"
    }).on("drag", _.bind(this.updateScroll, this))

    this.list_data.length > 0 ? this.renderList() : this.$el.find("ul").append('<li class="empty">No data available</li>')

    return this
  },
  renderList: function () {
    this.$el.find("ul").empty();
    var t = this
    var e = this.search
    var i = new RegExp(this.search, "i")
    var n = ""
    var s = ""
    this.search ? this.$el.find("i.clear-search").show() : this.$el.find("i.clear-search").hide()
    
    _.each(this.list_data, function (o) {
      if ("object" == typeof o) {
        if (o.hasOwnProperty("name")) {
          s = o.name
          n += '<li class="group">' + _.escape(o.name) + "</li>"
        } else if (o.hasOwnProperty("display")) {
          n += '<li class="item" data-value="' + _.escape(o.value) + '">' + _.escape(o.display) + "</li>"
        }
      } else if (!e || o.match(i)) {
        var a = o;
        if (!t.showFullValue) {
          "artifact:*.cef" === s
            ? a = a.substring(s.length + 1)
            : _.startsWith(a, "container:")
              ? a = a.substring("container:".length)
              : _.startsWith(a, "filtered-artifact:*.cef.")
                ? a = a.substring("filtered-artifact:*.cef.".length)
                : -1 !== a.indexOf(".") && (a = a.substring(a.indexOf(".") + 1))
        }
        var r = "" !== s ? "item subitem" : "item";
        n += '<li class="' + r + '" data-value="' + _.escape(o) + '">' + _.escape(a) + "</li>"
      }
    })
    
    "" === n && (n = '<li class="empty">No matching parameters</li>')
    
    this.$el.find("ul").append(n)
    this.updateSize()
  },
  doSearch: function () {
    this.search = this.$el.find("input.dropdown-search").val()
    this.renderList()
  },
  clearSearch: function (t) {
    t.preventDefault()
    this.search = ""
    this.$el.find("input.dropdown-search").val("")
    this.renderList()
  },
  toggle: function (t) {
    this.setFocus()
    this.enabled && (this.isOpen ? this.close() : this.open())
  },
  open: function () {
    var t = this
    var e = this.$el.find(".dropdown-menu")

    this.isOpen = !0
    this.$el.addClass("open").removeClass("error")
    this.enableBodyClick(), this.updateSize()

    var i = this.container
      ? $(this.container).height()
      : $(window).height()
    var n = this.container ? 200 : 400
    this.$el.offset().top + 200 > i && i > n ? e.addClass("up").slideDown(100, function () {
      t.updateSize()
    }) : e.slideDown(100, function () {
      t.updateSize()
    })
  },
  close: function () {
    var t = this.$el.find(".dropdown-menu");
    this.isOpen = !1
    this.$el.removeClass("open").removeClass("error")
    t.hasClass("up")
      ? t.hide().removeClass("up")
      : t.slideUp(100)
    this.disableBodyClick()
  },
  select: function (t) {
    this.value = $(t.target).data("value")
    this.useDisplay
      ? $("input.widget-value", this.$el).val($(t.target).text())
      : $("input.widget-value", this.$el).val(this.value)
    this.updateModelData()
    this.close()
  },
  updateValue: function () {
    this.value = $("input.widget-value", this.$el).val()
    this.updateModelData()
    this.clearFocus()
  },
  updateModelData: function () {
    this.model && this.model.set(this.field_name, this.value)
    "" !== this.action && this.dispatcher.trigger(this.action, this.value)
  },
  showTip: function (t) {
    if (this.enableTooltip && this.value && !this.tooltip) {
      var e = this.$el.find("input").offset(),
        i = $("input.widget-value", this.$el).val();
      this.tooltip = $("<div/>").addClass("tooltip right").html(i).css({
        display: "none",
        top: e.top,
        left: e.left + this.$el.width() + 10
      })
      $("body").append(this.tooltip)
      this.tooltip.fadeIn(200)
    }
  },
  hideTip: function (t) {
    var e = this;
    this.enableTooltip && this.tooltip && this.tooltip.fadeOut(200, function () {
      e.tooltip.remove(), e.tooltip = null
    })
  },
  updateSize: function () {
    this.trackHeight = 300, this.$track.css({
      height: this.trackHeight
    }), this.$content.height() < this.trackHeight ? (this.$track.hide(), this.show = !1) : (this.$track.show(), this.show = !0), this.updateHandle()
  },
  updateScroll: function (t) {
    this.percent = this.$handle.position().top / (this.trackHeight - this.$handle.height()), this.$content.css({
      top: -((this.$content.height() - this.trackHeight) * this.percent)
    })
  },
  updateHandle: function () {
    this.$handle.css({
      top: (this.trackHeight - this.$handle.height()) * this.percent
    })
  },
  handleWheel: function (t) {
    if (this.show) {
      t.stopPropagation(), t.preventDefault();
      var e = t.originalEvent.wheelDelta / 120,
        i = this.$handle.position().top - 32 * e;
      0 > i ? i = 0 : i > this.trackHeight - this.$handle.height() && (i = this.trackHeight - this.$handle.height()), this.$handle.css({
        top: i
      }), this.updateScroll()
    }
  }
})
