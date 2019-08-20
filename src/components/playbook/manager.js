/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'
import $ from 'jquery'

import Canvas from './views/canvas'

export default _bb.View.extend({
  initialize: function ({
    mountId, // 编辑器挂载的节点id
  }) {
    this.initDOM(mountId)
    this.render()
  },
  initDOM: function (mountId) {
    // 插入占位节点
    const canvasId = `${mountId}_canvas`
    this.canvasId = canvasId
    $(`#${mountId}`).append(`<div id="${canvasId}"></div>`)
  },
  render: function () {
    this.canvas = new Canvas(this.canvasId)
  },
})
