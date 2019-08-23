/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'
import $ from 'jquery'

export default _bb.Model.extend({
  defaults: {
    id: '-',
    name: '',
    action: '',
    appid: '',
    app_name: '',
    app_version: '',
    product_vendor: '',
    product_name: '',
    fields: {},
    output: {},
    type: '',
    config_type: 'asset',
    active: false,
    loaded: false,
    missing: false,
    has_app: true,
  },
  asJSON: function () {
    return this.toJSON()
  },
  url: function () {
    var t = ''
    var e = {}
    if (this.get('config_type') === 'app' || this.get('missing') && !this.get('loaded')) {
      t = '/coa/app_config?'
      e = {
        app_name: this.get('app_name'),
        action: this.get('action'),
      }
    } else {
      t = '/coa/asset/' + this.id + '?'
      e = {
        action: this.get('action'),
      }
    }
    const res = t += $.param(e)
    return res
  },
})
