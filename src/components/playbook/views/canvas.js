/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'
import $ from 'jquery'
import * as joint from 'jointjs'
import 'jointjs/dist/joint.css'
import {
  defaults,
} from 'lodash'

import {
  defaultProps,
} from '../nodes/base'
import {
  StartEndModel,
  StartEndView,
} from '../nodes/StartEnd'

export default _bb.View.extend({
  el: '',
  initialize: function (id) {
    this.el = `#${id}`
    this.mountNodes()
    this.initJointInstance()
    this.render()
  },
  render: function () {
  },
  /** 挂载自定义节点 */
  mountNodes: function () {
    joint.shapes['cmChart'] = {}
    joint.shapes['cmChart'].StartEnd = StartEndModel
    joint.shapes['cmChart'].StartEndView = StartEndView
  },
  /** 初始化jointjs实例 */
  initJointInstance: function () {
    this.graph = new joint.dia.Graph()
    this.paper = new joint.dia.Paper({
      el: $(this.el),
      model: this.graph,
      width: '100%',
      height: '100%',
      multiLinks: false,
      perpendicularLinks: true,
      snapLinks: {
        radius: 50,
      },
      drawGrid: true,
      gridSize: defaultProps.gridSize,
      clickThreshold: 10,
      cellViewNamespace: joint.shapes,

      linkView: joint.dia.LinkView.extend({
        options: defaults({
          doubleLinkTools: true,
          doubleLinkToolsOffset: 40,
        }, joint.dia.LinkView.prototype.options),
      }),
      defaultLink: new joint.dia.Link({
        connector: {
          name: 'rounded',
          args: {
            radius: 5,
          },
        },
        router: {
          name: 'metro',
        },
        startDirections: ['right'],
        endDirections: ['left'],
        attrs: {
          '.marker-target': {
            d: 'M 10 0 L 0 5 L 10 10 z',
            fill: '#818D99',
            stroke: '#818D99',
          },
          '.connection': {
            stroke: '#818D99',
            strokeWidth: 2,
          },
        },
      }),
      interactive: function (target) {
        return target.model instanceof joint.dia.Link ? {
          vertexAdd: false,
        } : true
      },
      // 校验连接是否成立
      validateConnection: function (cellViewS, magnetS, cellViewT, magnetT) {
        return cellViewT.model.get('type') === 'link'
          ? false
          : (magnetS && magnetS.getAttribute('type') === 'input')
            ? false
            : (magnetT && magnetT.getAttribute('type') === 'output')
              ? false
              : cellViewS === cellViewT
                ? false
                : (
                  cellViewT.model.get('type') === `${defaultProps.prefix}.StartEnd` &&
                  cellViewS.model.get('type') === `${defaultProps.prefix}.StartEnd`
                )
                  ? false
                  : magnetS != magnetT
      },
      validateMagnet: function (t, e) {
        return e.getAttribute('type') !== 'input'
      },
    })
  },
})
