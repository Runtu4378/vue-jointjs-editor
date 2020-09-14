import ListHeader from './ListHeader'
import Search from './Search'
import Scroller from '../../../widgets/Scroller'

const template = `
<div class="logo-wrapper">
  <div class="app-logo" style="background-image: url('<%= logoURL %>')"></div>
</div>
<div class="app-name"><%- name %></div>
`

export default Backbone.View.extend({
  className: 'app-list',
  initialize: function (t) {
    this.filter = t && t.filter ? t.filter : ''
    this.search_string = ''
    this.headerView = new ListHeader()
    this.searchView = new Search({
      placeholder: '输入关键字查找 APP',
      event: 'search:applist',
    })
    this.scrollerView = new Scroller({
      tmpl: template,
      clickEvent: 'app:select',
    })
    this.listenTo(this.dispatcher, 'search:applist', this.doSearch)
  },
  render: function () {
    this.$el.append(this.headerView.el, this.searchView.render().el, this.scrollerView.el)
    this.filterApps()
    return this
  },
  remove: function () {
    this.headerView.remove()
    this.searchView.remove()
    this.scrollerView.remove()
    Backbone.View.prototype.remove.apply(this)
  },
  doSearch: function (t) {
    this.search_string = t.toLowerCase().trim()
    this.filterApps()
  },
  // 筛选app列表
  filterApps: function () {
    let result = this.apps.where({
      // is_configured: true, // 暂时没有筛选
    })
    result = new Backbone.Collection(result)
    if (this.search_string) {
      result = result.filter((e) => {
        return e.get('name').toLowerCase().indexOf(this.search_string) !== -1
      })
      result = new Backbone.Collection(result)
    }

    this.headerView.title = this.search_string === ''
      ? '全部 App'
      : '匹配到的 App'
    this.headerView.count = result.length

    this.scrollerView.model = result
    this.headerView.render()
    this.scrollerView.render()
    if (result.length === 0) {
      this.scrollerView.$el.find('ul').append('<li class="inactive">没有匹配的 App</li>')
      this.scrollerView.resetScroller()
    }
  },
})
