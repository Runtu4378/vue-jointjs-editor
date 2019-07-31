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
      // cellViewNamespace: joint.shapes,
    })
  }

  /** 初始化起点终点 */
  initStartAndEnd () {
    const startNode = new joint.shapes.cmChart.StartEnd({
      attrs: {
        'text.title': {
          text: 'START',
        },
        '.outPorts circle': {
          fill: '#51B252',
        },
      },
    })
    startNode.position(
      props.gridSize * 3,
      props.gridSize * 6,
    )
    // console.log(startNode)
    // const view = this.paper.findViewByModel(joint.shapes.cmChart.StartEnd);
    // startNode.set({
    //   id: startNode.id,
    //   outPorts: ['out'],
    // });
    startNode.set('outPorts', ['out'])
    // startNode.resize(100, 40);
    this.graph.addCell(startNode)
    // const view = this.paper.findViewByModel(startNode);
    // const view = this.paper.findViewByModel(joint.shapes.cmChart.StartEnd)
    // console.log(view)
  }
}
