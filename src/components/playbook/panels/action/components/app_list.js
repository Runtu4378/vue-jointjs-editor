/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'
import _lo from 'lodash'

import ListHeader from './list_header'
import Search from './search'
import Scroller from '../../../widgets/scroller/scroller'

const template = `<div class="logo-wrapper<% if (show_dark_logo) {%> dark<% } %>"><div class="app-logo" style="background-image: url('/app_resource/<%= directory %>/<% if (show_dark_logo) {%><%= _pretty_dark_logo %><% } else { %><%= logo %><% } %>')"></div></div><div class="app-name"><%- name %></div>
`

export default _bb.View.extend({
  className: 'app-list',
  initialize: function (t) {
    this.filter = t && t.filter ? t.filter : ''
    this.search_string = ''
    this.headerView = new ListHeader()
    this.searchView = new Search({
      placeholder: 'Search apps',
      event: 'search:applist',
    })
    this.scrollerView = new Scroller({
      tmpl: template,
      clickEvent: 'app:select',
    })
    this.listenTo(this.dispatcher, 'search:applist', this.doSearch)
  },
  remove: function () {
    this.headerView.remove()
    this.searchView.remove()
    this.scrollerView.remove()
    _bb.View.prototype.remove.apply(this)
  },
  render: function () {
    this.$el.append(this.headerView.el, this.searchView.render().el, this.scrollerView.el)
    this.filterApps()
    return this
  },
  filterApps: function () {
    var t = this
    var n = this.apps.where({
      is_configured: true,
    })
    n = new _bb.Collection(n)
    if (this.search_string) {
      n = n.filter(function (e) {
        return e.get('name').toLowerCase().indexOf(t.search_string) !== -1 || e.get('product_vendor').toLowerCase().indexOf(t.search_string) !== -1
      })
      n = new _bb.Collection(n)
    }
    n.comparator = 'product_vendor'
    n.sort()
    if (this.filter === 'action') {
      var s = this.model.get('action')
      n = n.filter(function (t) {
        var e = t.get('actions')
        return _lo.indexOf(e, s) !== -1
      })
      n = new _bb.Collection(n)
    }
    this.headerView.title = this.search_string === ''
      ? 'Available Apps'
      : 'Matching Apps'
    this.headerView.count = n.length
    this.scrollerView.model = n
    this.headerView.render()
    this.scrollerView.render()
    if (n.length === 0) {
      this.scrollerView.$el.find('ul').append('<li class="inactive">No matching apps</li>')
      this.scrollerView.resetScroller()
    }
  },
  doSearch: function (t) {
    this.search_string = t.toLowerCase().trim()
    this.filterApps()
  },
})
