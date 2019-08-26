/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'
import _ from 'underscore'

import ModelsApp from '../models/app'

export default _bb.Collection.extend({
  url: '/rest/app?page_size=0&sort=name&pretty',
  model: ModelsApp,
  comparator: function (t) {
    return t.get('name')
  },
  parse: function (t) {
    return t.data
  },
  setActions: function () {
    var t = this
    this.app_actions.actionsForApp(this.appId)
    _.each(this.models, function (e) {
      var i = _.map(t.app_actions.actionsForApp(e.id), function (t) {
        return t.get('action')
      })
      e.set('actions', i)
      e.set('show_dark_logo', e.get('_pretty_dark_logo') && window.PHANTOM_THEME === 'dark')
    })
  },
  findByAsset: function (t) {
    var e = null
    t.appid
      ? e = this.findWhere({
        appid: t.appid,
      })
      : t.product_name && t.product_vendor && (e = this.findWhere({
        product_name: t.product_name,
        product_vendor: t.product_vendor,
      }))
    return e
  },
})
