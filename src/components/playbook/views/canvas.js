/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'
import $ from 'jquery'
import _ from 'underscore'
import * as joint from 'jointjs'
import 'jointjs/dist/joint.css'
import {
  defaults,
} from 'lodash'

import '../jointjs/extend'

import {
  defaultProps,
} from '../nodes/base'
import {
  IntroModel,
  IntroView,
} from '../nodes/Intro'
import {
  SelectorModel,
  SelectorView,
} from '../nodes/Selector'
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
    this.initSelector()
    this.initEvent()
    this.render()
  },
  render: function () {
    // const that = this
    // const coaData = this.playbook.get('coa_data')
    if (this.playbook.get('name') === '') {
      // 初始化默认内容
      const startBlock = new StartEndModel('START', '#4FB970')
      startBlock.position(100, 100)
      startBlock.set('outPorts', ['out'])
      startBlock.set({
        state: 'start',
        status: '',
        order: 1,
      })
      this.blocks.add(startBlock)

      const endBlock = new StartEndModel('END', '#C43947')
      endBlock.position(640, 100)
      endBlock.set('inPorts', ['in'])
      endBlock.set({
        state: 'end',
        status: '',
        order: 2,
      })
      this.blocks.add(endBlock)

      this.startBlock = startBlock
      this.endBlock = endBlock

      this.graph.addCell([startBlock, endBlock])
      // 操作提示控件
      this.intro = new IntroModel()
      this.intro.position(220, 60)
      this.graph.addCell([this.intro])
      $(`${this.el} g.start`).addClass('pulse')
    }
  },
  /** 挂载自定义节点 */
  mountNodes: function () {
    joint.shapes['cmChart'] = {}
    joint.shapes['cmChart'].Intro = IntroModel
    joint.shapes['cmChart'].IntroView = IntroView
    joint.shapes['cmChart'].Selector = SelectorModel
    joint.shapes['cmChart'].SelectorView = SelectorView
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
                  /* eslint-disable-next-line */
                  : magnetS != magnetT
      },
      validateMagnet: function (t, e) {
        return e.getAttribute('type') !== 'input'
      },
    })
  },
  /** 初始化选择器 */
  initSelector: function () {
    this.selector = new SelectorModel()
    this.selection = new joint.ui.Selection({
      paper: this.paper,
      filter: ['cmChart.StartEnd'],
    })
    this.selection.removeHandle('rotate')
    this.selection.removeHandle('resize')
    this.selection.changeHandle('remove', {
      position: 'ne',
      events: {
        pointerdown: null,
      },
    })
    // this.selection.on('selection-box:pointerdown', _.bind(this.selectionMouseDown, this))
    // this.selection.on('action:remove:pointerdown', _.bind(this.removeSelected, this))
  },
  /** 初始化事件 */
  initEvent: function () {
    this.paper.on('link:connect', this.changeConnection, this)
  },

  /** ---事件处理-start--- */
  /** 隐藏提示 */
  removeIntro: function () {
    var t = this
    if (this.intro) {
      var e = this.paper.findViewByModel(this.intro)
      $(`${this.el} g.joint-type-coa-intro`).animate({
        opacity: 0,
      }, 200, function () {
        e.remove()
        t.intro.remove()
        $(`${this.el} g.start`).removeClass('pulse')
      })
    }
  },
  changeConnection: function (t) {
    this.removeIntro()
    var e = this.graph.getCell(t.model.get('target').id)
    this.dispatcher.trigger('code:update')
    this.blockSourceChange(e)
  },
  /** ---事件处理-end--- */
})
