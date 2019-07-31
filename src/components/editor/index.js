/* eslint comma-dangle: ["error", "always-multiline"] */

import * as joint from 'jointjs'
import 'jointjs/dist/joint.css'
import {
  defaults,
} from 'lodash'

import props from './props.js'
import nodeDefine from './nodes/index.js'

export default class Editor {
  /** 挂载dom的id */
  id = null
  /** joint.graph 实例 */
  graph = null
  /** joint.paper 实例 */
  paper = null

  constructor ({
    id,
    value,
  }) {
    this.id = id
    this.initInstance()
    nodeDefine()
    this.initStartAndEnd()
    console.log(joint.shapes)
  }

  /** 初始化joint实例 */
  initInstance () {
    this.graph = new joint.dia.Graph()
    this.paper = new joint.dia.Paper({
      el: document.getElementById(this.id),
      model: this.graph,
      width: '100%',
      height: '100%',
      multiLinks: false,
      perpendicularLinks: true,
      snapLinks: {
        radius: 50,
      },
      drawGrid: true,
      gridSize: props.gridSize,
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
                  cellViewT.model.get('type') === `${props.prefix}.StartEnd` &&
                  cellViewS.model.get('type') === `${props.prefix}.StartEnd`
                )
                  ? false
                  : magnetS != magnetT
      },
      validateMagnet: function (t, e) {
        return e.getAttribute('type') !== 'input'
      },
    })
  }

  /** 初始化起点终点 */
  initStartAndEnd () {
    const startNode = new joint.shapes.cmChart.StartEnd('START')
    startNode.position(
      props.gridSize * 3,
      props.gridSize * 6,
    )
    startNode.set('outPorts', ['out'])
    this.graph.addCell(startNode)

    const endNode = new joint.shapes.cmChart.StartEnd('END')
    endNode.position(
      props.gridSize * 3,
      props.gridSize * 12,
    )
    endNode.set('inPorts', ['in'])
    this.graph.addCell(endNode)
  }
}
