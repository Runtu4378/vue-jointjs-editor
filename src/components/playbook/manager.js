/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'
import _ from 'underscore'
import $ from 'jquery'

import './font/Roboto.css'
import './font-awesome/css/font-awesome.min.css'
import './jquery/css/jquery-ui.css'
import './jointjs/rappid.min.css'
import './css/coa.css'

import { defaultProps } from './nodes/base'
import Header from './views/header/main'
import Canvas from './views/canvas'
import Panels from './panels/manager'

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
    this.template = _.template(template)
    this.initDOM(mountId)
    this.render()
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
      theme: window.PHANTOM_THEME,
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
    const mountId = this.mountId
    this.header = new Header()
    this.canvas = new Canvas(mountId, this.paperId)
    this.panels = new Panels({
      id: this.panelId,
      canvas: this.canvas,
    })
  },
})
