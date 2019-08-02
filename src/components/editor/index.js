/* eslint comma-dangle: ["error", "always-multiline"] */

import * as joint from 'jointjs'
import 'jointjs/dist/joint.css'
import {
  bind,
  each,
  filter,
} from 'lodash'

import defaultProps from './defaultProps'
import Viewer from './viewer'
import './views/Selection.js'
import Model from './model'

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
    this.initEvent()
    this.initStartAndEnd()
    this.initOtherExample()
    // this.initSelection()
  }

  /** 初始化事件监听 */
  initEvent () {
    this.paper.on('cell:pointerclick', this.cellMouseClick, this)
    this.model.on('change:collection', function (model, collection) {
      // console.log(collection)
      this.viewer.setData(collection)
    }, this)
  }

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
        x: defaultProps.gridSize * 3,
        y: defaultProps.gridSize * 12,
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
        y: defaultProps.gridSize * 6,
      },
    })
  }

  /** 事件处理-start */
  removeAction (model) {
    const e = this.paper.findViewByModel(model)
    const i = model.get('action')

    this.resetSelection()
    this.blocks.remove(model)
    this.graph.removeLinks(model)

    const n = this.graph.get('cells')
    this.graph.resetCells(filter(n.models, function (e) {
      return e.id !== model.id
    }))
    e.remove()
    this.blockCleanup(model, i)
    this.updateBlockOrder()
    this.dispatcher.trigger('editor:close')
    this.dispatcher.trigger('debug:close')
    this.dispatcher.trigger('code:update')
    this.dispatcher.trigger('playbook:change:code')
  }
  selectionMouseDown (target, event) {
    if (event.ctrlKey || event.metaKey) {
      this.selection.collection.remove(target.model)
    }
  }
  removeSelected (event) {
    event.stopPropagation()
    var itemGet = filter(this.selection.collection.models, function (node) {
      return node.get('type') === `${props.prefix}.StartEnd`
    })
    var removeLength = itemGet.length > 0
      ? this.selection.collection.length - itemGet.length
      : this.selection.collection.length
    let message = 'Are you sure you want to delete ' + (removeLength > 1 ? 'these ' + removeLength + ' ' : 'this ') + ' block' + (removeLength > 1 ? 's' : '') + '?'
    if (removeLength !== 0) {
      if (itemGet > 0) {
        message += '<br/><br/>The Start and End blocks cannot be deleted.'
      }
      var props = {
        title: 'Remove selected blocks',
        message: message,
      }
      const callback = bind(this.confirmRemoveSelected, this)
      this.dispatcher.trigger('alert:show', props, {
        callback: callback,
      })
    }
  }
  confirmRemoveSelected () {
    const that = this
    each(this.selection.collection.models, (node) => {
      if (node.get('type') !== 'coa.StartEnd') {
        // TODO 连通下面这行的逻辑
        // that.removeAction(node)
      }
    })
    this.selection.collection.reset([])
  }

  cellMouseClick (target, evt) {
    // console.log(target)
    // console.log(evt)
    // console.log(this.selection)
    // return
    // var activeIdx = this.blocks.getActive()
    this.dispatcher.trigger('body:click')
    // this.clearSelector()
    // if (target.model !== activeIdx) {
      // this.resetSelection()
      if (
        !evt.metaKey &&
        target.model &&
        target.model.get('type') !== 'link'
      ) {
        this.coa.set('blockX', target.model.position().x)
        this.coa.set('actionSelectState', target.model.get('state'))
        this.coa.set('codeView', 'block')
        this.collectBlockData(target.model)
        target.model.set('active', true)
        this.removeIntro()
      }
      target.model.toFront()
    // }
  }
  /** 事件处理-end */
}
