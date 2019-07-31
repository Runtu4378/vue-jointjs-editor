/* eslint comma-dangle: ["error", "always-multiline"] */

import * as joint from 'jointjs'
import 'jointjs/dist/joint.css'

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
      gridSize: props.gridSize,
      drawGrid: 'dot',
      cellViewNamespace: joint.shapes,
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
