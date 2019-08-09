/* eslint comma-dangle: ["error", "always-multiline"] */

import _lodash from 'lodash'
import $ from 'jquery'
import _jqUi from 'jq_ui'
import _backbone from 'backbone'

import { view as Notification } from './widgets/notification'
import { view as Alert } from './widgets/alert'
import { view as Wait } from './widgets/wait'

const Router = _backbone.Router.extend({
  routes: {
    'playbook(/)': 'create',
    'playbook/:id(/)': 'view',
    'playbook/:id/edit(/)': 'edit',
    'playbook/archive/:scm/:commit/:title': 'archive',
    '*default': 'defaultRoute',
  },
  initialize: function () {
    var t = !!history.pushState
    this.dispatcher.on('gotoPath', this.gotoPath, this)
    this.dispatcher.on('setPath', this.setPath, this)
    this.listenTo(this.dispatcher, 'notification:show', this.showNotification)
    this.listenTo(this.dispatcher, 'alert:show', this.showAlert)
    this.listenTo(this.dispatcher, 'wait:show', this.showWait)
    this.listenTo(this.dispatcher, 'wait:close', this.closeWait)
    _backbone.history.start({
      pushState: t,
      hashChange: !t,
      silent: false,
    })
  },
  gotoPath: function (t) {
    this.navigate(t, {
      trigger: true,
    })
  },
  setPath: function (t) {
    this.navigate(t)
  },
  create: function () {
    this.playbook.fetch()
  },
  view: function (t) {
    this.playbook.set('id', t)
    this.playbook.fetch()
  },
  edit: function (t) {
    this.playbook.set('id', t)
    this.playbook.fetch()
  },
  archive: function (t, e, i) {
    this.playbook.url = '/coa/archive/' + t + '/' + e + '/' + i
    this.playbook.fetch()
  },
  defaultRoute: function (t) {},
  showNotification: function (t) {
    /* eslint-disable-next-line */
    new Notification(t)
  },
  showAlert: function (t, e) {
    /* eslint-disable-next-line */
    new Alert(t, e)
  },
  showWait: function (t) {
    /* eslint-disable-next-line */
    this.wait = new Wait(t)
  },
  closeWait: function () {
    if (this.wait) {
      this.wait.remove()
      this.wait = null
    }
  },
})

const app = {
  init: function () {
    this.router = new Router()
    // this.manager = new e
  },
}

const Progress = _backbone.View.extend({
  render: function () {
    return this
  },
  remove: function () {
    var t = this
    $('#loader').delay(300).fadeOut(500, function () {
      $(this).hide()
      if (t.coa.missing_assets.length > 0) {
        t.dispatcher.trigger('resolve:open')
      }
      if (t.coa.missing_message !== '') {
        t.dispatcher.trigger('notification:show', {
          message: t.coa.missing_message,
          autoHide: false,
          type: 'error',
        })
      }
    })
  },
  set: function (t) {
    $('#loader .status').html(t)
  },
  error: function (t) {
    $('#loader .loading, #loader .status').remove()
    $('#loader .error').append('<div>' + t + '</div>')
  },
})

const init = () => {
  var dispatcher, i, s, M, S, T, N, D;
  const initBB = () => {
    if (!this.isExtended) {
      dispatcher = _lodash.extend({}, _backbone.Events, {
        cid: 'dispatcher',
      })
      const progress = new Progress()
      // coa = new _mCoa()
      // i = new _mPlaybook()
      // coa_settings = new _mCoaSetting()
      // contains = new _cContain()
      // cefs = new _cCef()
      // app_actions = new _cAppAction()
      // s = new _cAction()
      // M = new _cAsset()
      // S = new _cActionType()
      // T = new _cAssetType()
      // N = new m()
      // system_tags = new v()
      // D = new b()
      // blocks = new y()
      // users = new w()
      // roles = new x()
      // apis = new _()
      // dlists = new C()
      // cef_data = k
      progress.set('Processing system information')
      return _lodash.each([
        _backbone.Collection.prototype,
        _backbone.Model.prototype,
        _backbone.View.prototype,
        _backbone.Router.prototype,
      ], function (n) {
        return _lodash.extend(n, {
          dispatcher,
          progress: progress,
          // coa: coa,
          // playbook: i,
          // coa_settings: coa_settings,
          // contains: contains,
          // cefs: cefs,
          // app_actions: app_actions,
          // actions: s,
          // system_assets: M,
          // action_types: S,
          // asset_types: T,
          // tags: N,
          // system_tags: system_tags,
          // apps: D,
          // blocks: blocks,
          // users: users,
          // roles: roles,
          // apis: apis,
          // dlists: dlists,
          // cef_data: cef_data,
          // field_data: t.indexBy(I.sort(), function (t) {
          //   return t
          // }),
          // artifact_data: t.indexBy(A, function (t) {
          //   return t
          // })
        })
      })
    }
  }

  initBB()

  $.ajaxSetup({
    cache: false,
    beforeSend: function (t, i) {
      function func (str) {
        var returnStr = null
        if (
          document.cookie &&
          document.cookie !== ''
        ) {
          for (var cookieStr = document.cookie.split(';'), s = 0; s < cookieStr.length; s++) {
            var subStr = $.trim(cookieStr[s])
            if (subStr.substring(0, str.length + 1) === str + '=') {
              returnStr = decodeURIComponent(subStr.substring(str.length + 1))
              break
            }
          }
        }
        return returnStr
      }
      t.setRequestHeader('X-CSRFToken', func('csrftoken'))
    },
  })

  SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function (t) {
    return t.getScreenCTM().inverse().multiply(this.getScreenCTM())
  }
  app.init()
}

init()
