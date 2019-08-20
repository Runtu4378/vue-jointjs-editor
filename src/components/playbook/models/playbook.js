/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'

export default _bb.Model.extend({
  urlRoot: '/coa/playbooks',
  defaults: {
    id: '',
    name: '',
    coa_data: {},
  },
  errors: {},
  initialize: function () {
    this.loaded = false
    this.on('sync', this.onSync, this)
    this.on('change:name', this.markModified, this)
  },
  // 关联数据源的更改到Model
  onSync: function () {
    var nowData = this.get('coa_data')
    if (!nowData.clean || this.get('id') === '') {
      this.set('clean', false)
    }
    this.loaded = true
  },
  markModified: function () {
    if (this.loaded) {
      // this.coa.set('modified', true)
    }
  },
})
