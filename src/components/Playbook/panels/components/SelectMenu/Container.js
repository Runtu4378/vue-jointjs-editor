import Drawer from '../../Drawer'
import Scrollable from '../../../widgets/mixins/Scrollable'
import Search from '../../Action/components/Search'
// import ContainsFilter from './ContainsFilter'
import FieldScroller from './FieldScroller'

const template = `
<div class="menu-filter"></div>
<div class="menu-container">
  <div class="menu-groups">
    <ul class="scroller-content"></ul>
    <div class="scroller-track">
      <div class="scroller-handle"></div>
    </div>
  </div>
  <div class="menu-items"></div>
</div>
`

export default Drawer.extend(_.extend({}, Scrollable, {
  className: 'select-menu',
  events: {
    'click li.group': 'selectGroup',
    'click li.item': 'selectValue',
    'keyup input': 'doSearch',
    'change .menu-items .scroller-content input': 'selectInputValue',
    'change .datetime-picker .hasDatepicker': 'selectInputValue',
    'wheel .menu-groups': 'handleWheel',
    'mouseenter .menu-groups': 'showScroller',
    'mouseleave .menu-groups': 'hideScroller',
  },
  initialize: function (t) {
    this.template = _.template(template)
    this.search = ''
    this.input = null
    this.contains = []
    this.key_data = {}
    this.key_fields_map = {}
    this.filteringOn = true
    this.prependKey = false
    this.keySeperator = '/'
    this.rawValue = t.rawValue
      ? t.rawValue
      : false
    this.trackClass = '.menu-groups .scroller-track'
    this.handleClass = '.menu-groups .scroller-handle'
    this.contentClass = '.menu-groups .scroller-content'

    this.initScrollable()
    this.listenTo(this.coa, 'change:showContains', this.updateContains)
  },
  render: function () {
    const that = this

    this.$el.html(this.template())

    this.key_data = {}
    this.key_fields_map = {}
    this.searchView = new Search({
      placeholder: 'Search',
    })
    this.$el.find('.menu-items').append(this.searchView.render().el)
    this.searchView.$el.find('input.search').val(this.search)

    const data = this.input.data
    var i = this.$el.find('.menu-groups ul')
    // var o = 0

    _.each(data, function (e) {
      that.key_data[e.name] = e
      that.key_fields_map[e.name] = e.fields
      i.append('<li class="group" data-value="' + e.name + '">' + e.name + '</li>')
    })

    // if (this.contains && this.input.filtered.length > 0) {
    //   _.each(this.input.data, function (t) {
    //     _.each(t.fields, function (t) {
    //       _.startsWith(t.value, '_MENU_GROUP_') || o++
    //     })
    //   })

    //   this.containsFilter = new ContainsFilter({
    //     model: this.contains,
    //     showing: n,
    //     total: o,
    //   })
    //   this.$el.find('.menu-filter').append(this.containsFilter.render().el)
    //   this.$el.find('#toggle-showContains').on('change', this.containsChange.bind(this))
    // }

    if (this.contains && this.input.filtered.length > 0) {
      this.filteringOn = true
    } else {
      this.$el.find('.menu-groups').addClass('no-contains')
      this.filteringOn = false
    }

    this.$el.find('.menu-groups li:first').click()
    this.renderScrollable()

    return this
  },
  remove: function () {
    this.open = false
    this.input = null
    this.key_data = {}
    this.key_fields_map = {}
    this.cleanup()
    Backbone.View.prototype.remove.apply(this)
  },
  cleanup: function () {
    this.searchView.remove()
    this.fieldScroller && this.fieldScroller.remove()
    this.dateTimePicker && this.dateTimePicker.remove()
    this.containsFilter && this.containsFilter.remove()
    this.$el.find('#toggle-showContains').off('change')
    this.removeScrollable()
  },
  selectGroup: function (event) {
    const target = $(event.currentTarget)
    this.$el.find('.menu-groups li').removeClass('selected')
    target.addClass('selected')
    this.active_field = target.data('value')
    this.populateMenu()
  },
  groupSelectHandler: function (t) {
    this.$el.find('.menu-groups li').removeClass('selected')
    t.addClass('selected')
    this.active_field = t.data('value')
    this.populateMenu()
  },
  populateMenu: function () {
    this.fieldScroller && this.fieldScroller.remove()
    this.dateTimePicker && this.dateTimePicker.remove()

    if (this.active_field === 'date') {
      this.searchView.remove()
      this.dateTimePicker = new Search({
        type: this.active_field,
        value: this.input.value,
      })
      this.dateTimePicker.key = this.key_fields_map[this.active_field]
      this.$el.find('.menu-items').append(this.dateTimePicker.render().el)
    } else {
      this.fieldScroller = new FieldScroller({
        rawValue: this.rawValue,
        containsOn: this.filteringOn,
      })
      this.fieldScroller.key = this.active_field
      this.fieldScroller.fields = this.key_fields_map[this.active_field]
      this.fieldScroller.search = this.search
      this.fieldScroller.filteringOn = this.filteringOn
      this.key_data[this.active_field].separator && (this.fieldScroller.separator = this.key_data[this.active_field].separator)
      this.$el.find('.menu-items').append(this.fieldScroller.render().el)
    }
  },
  selectValue: function (t) {
    var e = $(t.currentTarget)
    var i = e.data('value')

    this.prependKey && (i = this.active_field + this.keySeperator + i)
    this.input.setValue(i)
    this.dispatcher.trigger('select:toggle', this.input)
  },
  selectInputValue: function (t) {
    var e = $(t.currentTarget)
    var i = e.val()
    this.input.setValue(i)
    this.dispatcher.trigger('select:toggle', this.input)
  },
  doSearch: function () {
    this.search = this.$el.find('input.search').val()
    this.populateMenu()
  },
  updateContains: function () {
    this.cleanup()
    this.render()
  },
  containsChange: function (t) {
    this.$el.find('#toggle-showContains:checked').length > 0
      ? this.coa.set('showContains', true)
      : this.coa.set('showContains', false)
  },
}))
