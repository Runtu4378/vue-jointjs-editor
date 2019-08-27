/* eslint comma-dangle: ["error", "always-multiline"] */
/* globals $ */
// views/manager

import _bb from 'backbone'
import _ from 'underscore'
import _lo from 'lodash'
// import $ from 'jquery'
// import './jquery/js/jquery-ui.min.js'

import './font/Roboto.css'
import './font-awesome/css/font-awesome.min.css'
import './jquery/css/jquery-ui.css'
import './jointjs/rappid.min.css'
import './css/coa.css'

import { defaultProps } from './nodes/base'
import Header from './views/header/main'
import Canvas from './views/canvas'
import Panels from './panels/manager'
import Loader from './views/loader'

const template = `
<div class="content <% if (theme != 'light') { %>dark-theme<% } else { %>light-theme<% } %>">
  <div id="<%= headerId %>" class="cmc-header">
    <div class="top">
      <div class="logo"><img src="${defaultProps.imgPrefix}/splunk-phantom-logo.svg"></div>
    </div>
  </div>
  <div id="<%= rightPanelId %>" class="cmc-right-panel"></div>
  <div id="<%= stageContainerId %>" class="cmc-stage-container">
    <div class="stage" id="<%= stageId %>">
      <div class="editor-disabled"><div class="message">Visual Editor Disabled</div></div>
      <div id="<%= panelId %>" class="cmc-panel"></div>
      <div id="<%= paperId %>" class="cmc-paper"></div>
    </div>
  </div>
  <div id="<%= framesId %>" class="cmc-frames">
    <div id="<%= editorId %>" class="cmc-editor"></div>
    <div id="<%= debuggerId %>" class="cmc-debugger"></div>
  </div>
</div>
<div id="<%= notificationsId %>" class="cmc-notifications"></div>
<div id="<%= loaderId %>" class="cmc-loader">
  <div class="message">
    <div class="loader"></div>
    <div class="title">Loading Phantom Playbook Editor</div>
    <span class="status">Loading editor content</span>
    <div class="error"></div>
  </div>
</div>
`

export default _bb.View.extend({
  el: '',
  initialize: function ({
    mountId, // 编辑器挂载的节点id
  }) {
    this.el = `#${mountId}`
    this.mountId = mountId
    this.firstLoad = true
    this.template = _.template(template)
    this.initDOM(mountId)
    this.initEvent()
    this.initData()
    // this.render()
  },
  initDOM: function (mountId) {
    const headerId = this.headerId = `${mountId}_header`
    const rightPanelId = this.rightPanelId = `${mountId}_rightPanel`
    const stageContainerId = this.stageContainerId = `${mountId}_stageContainer`
    const stageId = this.stageId = `${mountId}_stage`
    const panelId = this.panelId = `${mountId}_panel`
    const paperId = this.paperId = `${mountId}_paper`
    const framesId = this.framesId = `${mountId}_frames`
    const editorId = this.editorId = `${mountId}_editor`
    const debuggerId = this.debuggerId = `${mountId}_debugger`
    const notificationsId = this.notificationsId = `${mountId}_notifications`
    const loaderId = this.loaderId = `${mountId}_loader`

    // 插入占位节点
    $(this.el).html(this.template({
      theme: defaultProps.theme,
      headerId,
      rightPanelId,
      stageContainerId,
      stageId,
      panelId,
      paperId,
      framesId,
      editorId,
      debuggerId,
      notificationsId,
      loaderId,
    }))

    //     $(`#${mountId}`)
    //       .addClass('stage-container')
    //       .addClass(window.PHANTOM_THEME === 'dark' ? 'dark-theme' : 'light-theme')
    //       .append(`
    // <div id="${canvasId}" class="cmc-canvas"></div>
    // <div id="${panelsId}" class="cmc-panel"></div>
    // `)
  },
  render: function () {
    // 加载必须组件
    if (this.firstLoad) {
      const mountId = this.mountId
      this.header = new Header(this.headerId)
      this.canvas = new Canvas(mountId, this.paperId)
      this.panels = new Panels({
        id: this.panelId,
        canvas: this.canvas,
      })
      this.loader = new Loader()
      this.firstLoad = false
    }

    // 初始化流程
    if (
      this.playbook.mode === 'edit' &&
      this.playbook.get('current_id') === ''
    ) {
      // 创建流程
      this.playbook.set('coa_schema_version', window.SCHEMA_VERSION)
      this.editPlaybook()
    } else {
      this.loader.checkForNewerVersion()
    }

    this.coa.set({
      modified: false,
      codeChanged: false,
      propsChanged: false,
    })

    return this
  },
  /** 初始化事件监听 */
  initEvent: function () {
    this.listenTo(this.apps, 'sync', this.appsReady)
  },
  /** 初始化数据 */
  initData: function () {
    this.apps.fetch({
      error: _.bind(this.app_error, this),
    })
  },

  editPlaybook: function () {
    this.dispatcher.trigger('notification:clear')
    this.loader.validate()
    this.canvas.runConversions()
    this.coa.set('editMode', true)
    this.blocks.getActive() && this.panels.update()
  },

  isReady: function () {
    var t = this
    if (
      // this.playbookLoaded &&
      // this.actionsLoaded &&
      // this.assetsLoaded &&
      this.appsLoaded
      // this.cefLoaded
    ) {
      _lo.each(this.apps.models, function (e) {
        var n = t.system_assets.where({
          product_name: e.get('product_name'),
        })
        n.length > 0 && _lo.filter(n[0].get('actions'), function (t) {
          return t !== 'on poll' && t !== 'test connectivity'
        }).length > 0 && e.set('is_configured', !0)
      })
      this.actions.setHasAssets()
      this.apps.setActions()
      this.render()
    }
  },
  app_error: function (t, e, i) {
    this.progress.error('Failed to load App data: View Apps permission required')
  },
  appsReady: function () {
    this.appsLoaded = true
    this.isReady()
  },
})
