/* eslint comma-dangle: ["error", "always-multiline"] */

import * as joint from 'jointjs'
import 'jointjs/dist/joint.css'
import {
  each,
  extend,
} from 'lodash'

import _bb from 'backbone'

import defaultProps from './defaultProps'
import Viewer from './viewer'
import './views/Selection.js'
import Model from './model'

import Coa from './models/coa'

export default class Editor {
  /** 挂载dom的id */
  id = null
  /** jointjs的graph实例 */
  graph = null
  /** jointjs的paper实例 */
  paper = null
  /** 节点实例 */
  model = null

  constructor ({
    id,
  }) {
    this.id = id
    this.viewer = new Viewer({ id })
    this.graph = this.viewer.graph
    this.paper = this.viewer.paper
    this.model = new Model()
    this.initMineBackbone()
    this.initEvent()
    this.initStartAndEnd()
    this.initOtherExample()
    // this.initSelection()
  }

  /** 初始化自定义backbone实例 */
  initMineBackbone () {
    const dispatcher = extend({}, _bb.Events, {
      cid: 'dispatcher',
    })
    return each([
      _bb.Collection.prototype,
      _bb.Model.prototype,
      _bb.View.prototype,
      _bb.Router.prototype,
    ], function (n) {
      return extend(n, {
        dispatcher,
        coa: new Coa(),
      })
    })
  }
  /** 初始化事件监听 */
  initEvent () {
    this.paper.on('cell:pointerclick', this.cellMouseClick, this)
    this.model.on('change:collection', function (model, collection) {
      // console.log(collection)
      this.viewer.setData(collection)
    }, this)
  }

  /** 初始化起点终点 */
  initStartAndEnd () {
    this.insertNode({
      type: `${defaultProps.prefix}.StartEnd`,
      title: 'START',
      position: {
        x: defaultProps.gridSize * 3,
        y: defaultProps.gridSize * 6,
      },
      outPorts: ['out'],
    })
    this.insertNode({
      type: `${defaultProps.prefix}.StartEnd`,
      title: 'END',
      position: {
        x: defaultProps.gridSize * 32,
        y: defaultProps.gridSize * 6,
      },
      inPorts: ['in'],
    })
  }

  /** 插入其他示例节点 */
  initOtherExample () {
    this.insertNode({
      type: `${defaultProps.prefix}.Action`,
      position: {
        x: defaultProps.gridSize * 12,
        y: defaultProps.gridSize * 5,
      },
    })
  }

  /** 方法-start */
  /** 插入节点 */
  insertNode (props) {
    if (!props) {
      throw new Error('invalid node prop')
    }
    const { type } = props
    let node = null
    if (type === `${defaultProps.prefix}.StartEnd`) {
      node = new joint.shapes[`${defaultProps.prefix}`].StartEnd(props.title)
      node.position(props.position.x, props.position.y)
      node.set({
        inPorts: props.inPorts,
        outPorts: props.outPorts,
      })
    } else if (type === `${defaultProps.prefix}.Action`) {
      node = new joint.shapes[`${defaultProps.prefix}`].Action()
      node.position(props.position.x, props.position.y)
      // node.set({
      // })
    }
    this.model.addNode(node)
  }
  /** 方法-end */
}
