/* eslint comma-dangle: ["error", "always-multiline"] */

import _backbone from 'backbone'
import _ from 'underscore'

export default _backbone.Model.extend({
  url: '/rest/cef_metadata',
  defaults: {
    cef: {},
    all_contains: [],
  },
  initialize: function () {
    this.on('sync', this.onSync, this)
  },
  onSync: function () {
    var t = this
    _.each(this.get('all_contains'), function (e) {
      t.contains.add({
        name: e,
        fields: [],
      }, {
        silent: true,
      })
    })
    _.each(this.get('cef'), function (e, i) {
      t.cefs.add({
        name: i,
        contains: e.contains,
        value: 'artifact:*.cef.' + i,
      })
      _.each(e.contains, function (e) {
        var n = t.contains.findWhere({
          name: e,
        })
        n && n.get('fields').push('artifact:*.cef.' + i)
      })
    })
    this.cefs.add({
      name: 'fromEmail',
      contains: ['email'],
      value: 'artifact:*.cef.fromEmail',
    })
    this.cefs.add({
      name: 'toEmail',
      contains: ['email'],
      value: 'artifact:*.cef.toEmail',
    })
    this.cefs.trigger('sync')
  },
})
