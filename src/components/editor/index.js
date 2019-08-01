/* eslint comma-dangle: ["error", "always-multiline"] */

import * as joint from 'jointjs'
import 'jointjs/dist/joint.css'
import {
  bind,
  defaults,
  each,
  filter,
} from 'lodash'

import props from './props.js'
import './views/Selection.js'
import nodeDefine from './nodes/index.js'

export default class Editor {
  /** 挂载dom的id */
  id = null
  /** joint.graph 实例 */
  graph = null
  /** joint.paper 实例 */
  paper = null

  selection = null

  constructor ({
    id,
    theme = 'light',
    value,
  }) {
    this.id = id
    this.initInstance()
    this.initTheme(theme)
    nodeDefine()
    console.log(joint)
    this.initStartAndEnd()
    this.initOtherExample()
    this.initSelection()
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

  /** 初始化主题配置 */
  initTheme (theme) {
    window.PLAYBOOK_THEME = theme
  }

  /** 初始化 */
  initSelection () {
    this.selection = new joint.ui.Selection({
      paper: this.paper,
      filter: [`${props.prefix}.StartEnd`],
    })
    this.selection.removeHandle('rotate')
    this.selection.removeHandle('resize')
    this.selection.changeHandle('remove', {
      position: 'ne',
      events: {
        pointerdown: null,
      },
    })
    this.selection.on('selection-box:pointerdown', bind(this.selectionMouseDown, this))
    this.selection.on('action:remove:pointerdown', bind(this.removeSelected, this))
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

  /** 插入其他示例节点 */
  initOtherExample () {
    const actionNode = new joint.shapes.cmChart.Action()
    actionNode.position(
      props.gridSize * 12,
      props.gridSize * 6,
    )
    this.graph.addCell(actionNode)
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
  /** 事件处理-end */
}
