import EditMode from '../../../widgets/mixins/EditMode'

import ListHeader from './ListHeader'
import Search from './Search'
import Scroller from '../../../widgets/Scroller'

const template = `
<div class="action-name"><%- name %></div>
<div class="action-description"><%- description %></div>
`

export default Backbone.View.extend(_.extend({}, EditMode, {
  className: 'action-list',
  initialize: function (baseProps) {
    const appid = this.model.get('appid')
    const app = this.apps.get(appid)

    this.app = app
    this.actionList = this.actions.where({
      appid: `${appid}`,
    })

    this.filter = baseProps && baseProps.filter
      ? baseProps.filter
      : ''
    this.search_string = ''
    this.headerView = new ListHeader()
    this.searchView = new Search({
      placeholder: '输入关键字查找 Action',
      event: 'search:actionlist',
    })
    this.scrollerView = new Scroller({
      tmpl: template,
      clickEvent: 'action:select',
    })

    this.listenTo(this.dispatcher, 'search:actionlist', this.doSearch)

    this.render()
  },
  render: function () {
    this.$el.append(
      this.headerView.el,
      this.searchView.render().el,
      this.scrollerView.el,
    )
    this.filterActions()
    this.setEditMode()
    return this
  },
  remove: function () {
    this.headerView.remove()
    this.searchView.remove()
    this.scrollerView.remove()
    Backbone.View.prototype.remove.apply(this)
  },
  filterActions: function () {
    const t = this
    let result = this.actionList
    let ifSearch = false
    if (this.search_string) {
      ifSearch = true
      result = result.filter(function (e) {
        return e.get('name').indexOf(t.search_string) !== -1
      })
      result = new Backbone.Collection(result)
    } else {
      result = new Backbone.Collection(result)
    }

    this.headerView.title = ifSearch
      ? '匹配的 Action'
      : '全部 Action'
    this.headerView.count = result.length

    this.scrollerView.model = result
    this.headerView.render()
    this.scrollerView.render()

    if (ifSearch && result.length === 0) {
      this.scrollerView.$el.find('ul').append('<li class="inactive">没有匹配的 Action</li>')
      this.scrollerView.resetScroller()
    }
    if (!ifSearch && result.length === 0) {
      this.scrollerView.$el.find('ul').append('<li class="inactive">没有 Action</li>')
    }
  },
  doSearch: function (t) {
    this.search_string = t.toLowerCase().trim()
    this.filterActions()
  },
}))
