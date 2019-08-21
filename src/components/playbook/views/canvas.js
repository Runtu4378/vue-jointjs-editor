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
  events: {
    mouseup: 'stopDrag',
    mouseleave: 'stopDrag',
  },
  initialize: function (mountId, id) {
    this.container = $(`#${mountId}`)
    this.el = `#${id}`
    this.fromX = null
    this.fromY = null
    this.doDrag = false

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
    this.resizePaper()
    this.loaded = true
    this.originX = 0
    this.originY = 0
    // console.log(this.$el)
    // console.log(this.paper.$el)
    this.paper.$el.on('mousemove', _.bind(this.onMouseMove, this))
    return this
  },
  /** 挂载自定义节点 */
  mountNodes: function () {
    joint.shapes['coa'] = {}
    joint.shapes['coa'].Intro = IntroModel
    joint.shapes['coa'].IntroView = IntroView
    joint.shapes['coa'].Selector = SelectorModel
    joint.shapes['coa'].SelectorView = SelectorView
    joint.shapes['coa'].StartEnd = StartEndModel
    joint.shapes['coa'].StartEndView = StartEndView
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
                  cellViewT.model.get('type') === 'coa.StartEnd' &&
                  cellViewS.model.get('type') === 'coa.StartEnd'
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
      filter: ['coa.StartEnd'],
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
    this.paper.on('cell:pointerclick', this.cellMouseClick, this)
    this.paper.on('cell:pointerdown', this.cellMouseDown, this)
    this.paper.on('cell:pointerup', this.cellMouseUp, this)
    // this.paper.on('blank:pointerdown', this.canvasMouseDown, this)
    // this.paper.on('blank:pointerup', this.canvasMouseUp, this)
    this.paper.on('translate', this.paperTranslate, this)
    this.dispatcher.on('panel:close', this.resetSelection, this)
  },

  /** ---事件处理-start--- */
  paperTranslate: function (t, e) {
    this.originX = t
    this.originY = e
  },
  canvasMouseDown: function (t) {
    var e = this
    if (t.target.nodeName === 'svg') {
      this.clearSelector()
      this.dragTimer = setTimeout(function () {
        e.startDrag(t)
      }, 100)
    }
    this.cancelClick = false
    this.coa.set('codeView', 'full')
    this.blocks.lastActive = null
  },
  canvasMouseUp: function (t) {
    clearTimeout(this.dragTimer)
    if (t.target.nodeName === 'svg' && !this.cancelClick) {
      this.selection.collection.reset([])
      this.dispatcher.trigger('panel:close')
      this.dispatcher.trigger('editor:close')
      this.dispatcher.trigger('debug:close')
      this.dispatcher.trigger('code:update')
    }
  },
  clearSelector: function () {
    if (this.active_link) {
      this.selector.remove()
      this.active_link = null
      $('div.tooltip').stop(!0, !1).fadeOut(200, function () {
        $(this).remove()
      })
    }
  },
  startDrag: function (t) {
    this.doDrag = true
  },
  stopDrag: function () {
    console.log('stopDrag')
    this.doDrag = false
    this.fromX = null
    this.fromY = null
  },
  resizePaper: function () {
    var t = this.container.width()
    var e = this.container.height()
    this.paper.setDimensions(t, e)
  },
  onMouseMove: function (t) {
    if (this.doDrag) {
      this.cancelClick = true
      if (this.fromX === null) {
        this.fromX = t.clientX - this.originX
        this.fromY = t.clientY - this.originY
      } else {
        var e = (this.$el.position(), t.clientX - this.fromX)
        var i = t.clientY - this.fromY
        this.paper.setOrigin(e, i)
      }
    }
  },
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
  cellMouseClick: function (t, e) {
    var i = this.blocks.getActive()
    this.dispatcher.trigger('body:click')
    this.clearSelector()
    if (t.model !== i) {
      this.resetSelection()
      if (
        !e.metaKey &&
        t.model &&
        t.model.get('type') !== 'link'
      ) {
        this.coa.set('blockX', t.model.position().x)
        this.coa.set('actionSelectState', t.model.get('state'))
        this.coa.set('codeView', 'block')
        this.collectBlockData(t.model)
        t.model.set('active', true)
        this.removeIntro()
      }
      t.model.toFront()
    }
  },
  resetSelection: function () {
    this.dispatcher.trigger('header:close')
    if (this.blocks.getActive()) {
      _.each(this.blocks.models, function (t) {
        t.set({
          active: false,
        })
      })
      setTimeout(this.validateBlockConfig.bind(this), 500)
    }
  },
  collectBlockData: function (t) {
    this.getSourceInputs(t)
    this.findBlockOutputs(t)
    this.getMenuData(t)
  },
  // TODO
  getMenuData: function (t) {
    var e = this
    var i = this.graph.getPredecessors(t, {
      breadthFirst: true,
    })
    var n = _.filter(i, function (t) {
      return t.get('type') === 'coa.StartEnd'
    })
    var s = n.length > 0
    var o = []
    if (s) {
      var a = n[0].getMenuData(t, e.graph)
      o = o.concat(a)
    }
    if (
      t.get('type') === 'coa.Filter' ||
      t.get('type') === 'coa.Decision'
    ) {
      let a = this.getCustomListMenu()
      o = o.concat(a)
      a = this.getDateTimeMenu()
      o = o.concat(a)
    }
    _.each(i.reverse(), function (i, n) {
      if (i.get('type') !== 'coa.StartEnd') {
        var s = i.getMenuData(t, e.graph)
        s.length > 0 && (o = o.concat(s))
      }
    })
    t.set({
      connected_to_start: s,
      parameters: o.reverse(),
    })
  },
  getSourceInputs: function (t) {
    var e = this
    var i = this.graph.getNeighbors(t, {
      inbound: true,
    })
    var n = ''
    var s = ''
    var o = {
      names: [],
      callbacks: [],
      functions: [],
    }
    _.each(i, function (t) {
      var i = e.findBlockSource(t)
      o.names = o.names.concat(i.names)
      o.callbacks = o.callbacks.concat(i.callbacks)
      o.functions = o.functions.concat(i.functions)
    })
    if (o.names.length > 0) {
      n = o.names.length === 1 && o.names[0] === 'start'
        ? 'object'
        : 'action'
      s = o.names.join(', ')
    }
    o.callbacks = _.compact(o.callbacks)
    o.functions = _.compact(o.functions)
    t.set({
      connection_type: n,
      connection_name: s,
    })
    t.inbound = o.functions
    t.inCount = i.length
    i.length === 1 && t.get('type') === 'coa.Action' && i[0].get('type') === 'coa.Action' && (t.parent_action = true)
  },
  findBlockOutputs: function (t) {
    var e = this.graph.getConnectedLinks(t, {
      outbound: true,
    })
    var i = []
    _.each(e, function (t) {
      var e = t.getTargetElement()
      if (
        e !== null &&
        e.get('type') !== 'coa.Selector'
      ) {
        var n = {
          function_name: e.getCallbackName(),
          port: t.get('source').port,
        }
        n.function_name !== null && i.push(n)
      }
    })
    t.outbound = i
  },
  cellMouseDown: function (t, e, i, n) {
    $(e.target).is('circle') && this.removeIntro()
  },
  cellMouseUp: function (t, e, i, n) {
    if (t.model.get('type') === 'link') {
      this.dispatcher.trigger('panel:close')
      this.dispatcher.trigger('frame:close')
      if (!t.model.get('target').id) {
        this.coa.set('blockX', i + 20)
        this.selector.position(i + 40, n)
        this.graph.addCell([this.selector])
        t.model.set('target', {
          id: this.selector.id,
        })
        this.active_link = t
        this.dispatcher.trigger('panel:selector')
      }
    } else if (
      this.coa.get('editMode') &&
      !this.coa.get('resolveOpen') &&
      (e.ctrlKey || e.metaKey) &&
      t.model.get('type') !== 'coa.Intro'
    ) {
      this.selection.collection.add(t.model)
      t.cellOut()
    }
  },
  changeConnection: function (t) {
    this.removeIntro()
    var e = this.graph.getCell(t.model.get('target').id)
    this.dispatcher.trigger('code:update')
    this.blockSourceChange(e)
  },
  blockSourceChange: function (t) {
    _.invoke(this.blocks.models, 'generateMenuData')
    this.validateBlockConfig()
    this.checkForLoops(t)
    var e = this.paper.findViewByModel(t)
    e.$el.find('.joint-highlight-stroke').remove()
  },
  validateBlockConfig: function () {
    _.invoke(this.blocks.models, 'validate', this.graph)
  },
  checkForLoops: function (t) {
    var e = this.graph.getSuccessors(t)
    var i = this.graph.getPredecessors(t)
    var n = _.compact(_.invoke(e, 'getFunctionName'))
    var s = _.compact(_.invoke(i, 'getFunctionName'))
    var o = _.intersection(n, s)
    if (o.length > 0) {
      var a = '<h4>Loop detected in playbook</h4>Configuration of loops is not fully supported using the UI.<br/>Custom code may be required for consistent behavior.'
      this.dispatcher.trigger('notification:clear')
      this.dispatcher.trigger('notification:show', {
        message: a,
        autoHide: !1,
        type: 'error',
      })
    } else {
      this.dispatcher.trigger('notification:clear')
      t.set({
        status: '',
      })
    }
  },
  /** ---事件处理-end--- */
})
