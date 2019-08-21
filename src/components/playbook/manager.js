/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'
import $ from 'jquery'

import './font/Roboto.css'
import './font-awesome/css/font-awesome.min.css'
import './jquery/css/jquery-ui.css'
import './jointjs/rappid.min.css'
import './css/coa.css'

import Canvas from './views/canvas'
import Panels from './panels/manager'

export default _bb.View.extend({
  initialize: function ({
    mountId, // 编辑器挂载的节点id
  }) {
    this.mountId = mountId
    this.initDOM(mountId)
    this.render()
  },
  initDOM: function (mountId) {
    // 插入占位节点
    const canvasId = `${mountId}_canvas`
    const panelsId = `${mountId}_panels`

    this.canvasId = canvasId
    this.panelsId = panelsId

    $(`#${mountId}`)
      .addClass('stage-container')
      .addClass(window.PHANTOM_THEME === 'dark' ? 'dark-theme' : 'light-theme')
      .append(`
<div id="${canvasId}" class="cmc-canvas"></div>
<div id="${panelsId}" class="cmc-panel"></div>
`)
  },
  render: function () {
    const mountId = this.mountId
    this.canvas = new Canvas(mountId, this.canvasId)
    this.panels = new Panels({
      id: this.panelsId,
      canvas: this.canvas,
    })
  },
})
