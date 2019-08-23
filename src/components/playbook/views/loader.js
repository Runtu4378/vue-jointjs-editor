/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'
import _ from 'underscore'

import ActionConfig from '../models/action_config'

const assetTemplate = `<li><i class="fa fa-warning"></i><b><%= name %></b><% if (app_name && product_name) { %> - App: <%= app_name %> (<%= app_version %>), Product: <%= product_name %> (<%= product_vendor %>)<% } %></li>
`
const appTemplate = `<li><i class="fa fa-warning"></i><b><%= app_name %> (<%= app_version %>)</b> - Asset: <%= name %>, Product: <%= product_name %> (<%= product_vendor %>)</li>
`

export default _bb.View.extend({
  className: 'loader',
  initialize: function () {
    this.assetTemplate = _.template(assetTemplate)
    this.appTemplate = _.template(appTemplate)
    this.assets = []
    this.assetIndex = 0
    this.missing_apps = []
  },
  render: function () {
    return this
  },
  validate: function () {
    this.checkVersion()
  },
  checkForNewerVersion: function () {
    if (this.playbook.get('coa_schema_version') > window.SCHEMA_VERSION) {
      var t = '<h4>Warning!</h4><div>This playbook was created on a newer version of the editor,</div><div>visual components may not display correctly.</div>'
      this.dispatcher.trigger('notification:show', {
        message: t,
        autoHide: false,
        type: 'error',
      })
    }
  },
  checkAssets: function () {
    this.initialize()
    var t = this
    var e = this.blocks.where({
      type: 'coa.Action',
    })
    var n = e.length
    n > 0 && this.dispatcher.trigger('wait:show', {
      message: 'Validating asset configuration',
    })
    _.each(e, function (e, n) {
      e.get('has_custom_block') || _.each(e.assets.where({
        config_type: 'asset',
      }), function (n) {
        var s = n.get('name')
        var o = n.get('app_name')
        var a = t.system_assets.findWhere({
          name: s,
        })
        var r = o ? t.apps.findByAsset(n.attributes) : !0
        var l = e.get('action')
        var c = t.actions.findWhere({
          action: l,
        }) ? !0 : !1
        if (a && r && c) {
          var h = new ActionConfig({
            id: a.id,
            action: e.get('action'),
          })
          t.assets.push({
            config: h,
            block: e,
          })
        } else {
          e.missing_assets.push(s)
          var u = {
            name: s,
            app_id: n.get('appid'),
            app_name: n.get('app_name'),
            app_version: n.get('app_version'),
            product_vendor: n.get('product_vendor'),
            product_name: n.get('product_name'),
            fields: n.get('fields'),
            output: n.get('output'),
            has_app: r && o ? !0 : !1,
            asset_config: n,
            action: l,
            block: e,
          }
          if (!(a && c)) {
            t.coa.missing_assets.push(u)
            e.missing_assets_data.push(u)
          }
          r || t.missing_apps.push(u)
        }
      })
    })
    this.checkAssetStatus()
  },
  checkAssetStatus: function () {
    if (this.assets.length > 0) {
      var t = this.assets[this.assetIndex]
      t.config.on('sync', _.bind(this.updateAssetStatus, this), this)
      t.config.fetch()
    } else {
      if (this.coa.missing_assets.length <= 0 && this.missing_apps.length <= 0) {
        this.showAssetStatus()
      } else {
        this.dispatcher.trigger('wait:close')
        this.progress.remove()
      }
    }
  },
  updateAssetStatus: function () {
    var t = this.assets[this.assetIndex]
    var e = t.config.get('parameters')
    var i = {}
    this.assetIndex += 1
    _.each(t.block.assets.models, function (e) {
      if (e.get('name') === t.config.get('asset_name')) {
        var i = e.get('fields')
        var n = {}
        _.each(_.keys(t.config.get('parameters')), function (t) {
          var e = i.hasOwnProperty(t) ? i[t] : ''
          n[t] = e
        })
        e.set('output', t.config.get('output'))
        e.set('fields', n)
      }
    })
    _.each(e, function (t, e) {
      t.required && (i[e] = !0)
    })
    t.block.set('required_params', i)
    this.assetIndex < this.assets.length ? this.checkAssetStatus() : this.showAssetStatus()
  },
  showAssetStatus: function () {
    this.dispatcher.trigger('wait:close')
    var t = this
    var e = _.uniq(this.coa.missing_assets, function (t) {
      return t.name
    })
    var i = _.uniq(this.missing_apps, function (t) {
      return t.name
    })
    var n = (e.length, i.length)
    var s = ''
    if (n > 0) {
      s += '<h4>This playbook uses ' + n + (n > 1 ? ' apps that are ' : ' app that is ') + 'not available</h4>'
      s += '<ul class="missing-assets">'
      _.each(i, function (e) {
        s += t.appTemplate(e)
      })
      s += '</ul>'
    }
    this.coa.missing_message = s
    this.coa.set('missingAssets', this.coa.missing_assets)
    this.progress.remove()
  },
  checkVersion: function () {
    if (this.playbook.get('coa_schema_version') < window.SCHEMA_VERSION && this.playbook.get('clean') && this.playbook.id !== '') {
      var t = {
        title: 'Generated Code Update',
        message: 'This playbook was created with an earlier version of the Phantom VPE. To continue with visual editing, generated code must be updated. Customized code will not be modified. Cancel if you wish to retain the existing code.',
        confirm: 'Continue',
      }
      var e = _.bind(this.confirmUpdate, this)
      this.dispatcher.trigger('alert:show', t, {
        callback: e,
        cancel: true,
        data: true,
        responseRequired: true,
      })
    }
  },
  confirmUpdate: function (t) {
    if (t) {
      this.playbook.set('clean', true)
      this.coa.set({
        editMode: true,
      })
      this.dispatcher.trigger('playbook:change:code')
      this.coa.get('codeView') !== 'full' && this.dispatcher.trigger('code:full')
    } else {
      this.playbook.set('clean', !1)
    }
  },
})
