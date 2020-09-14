import './libs/jointjs/extend'
import config from './config'

import {
  SelectorModel,
  SelectorView,
} from './nodes/Selector'
import {
  IntroModel,
  IntroView,
} from './nodes/Intro'

import {
  StartEndModel,
  StartEndView,
} from './nodes/StartEnd'
import {
  ActionModel,
  ActionView,
} from './nodes/Action'
import {
  FilterModel,
  FilterView,
} from './nodes/Filter'
import {
  DecisionModel,
  DecisionView,
} from './nodes/Decision'
const id = `#${config.layouts.paperId}`

// 画布缩放相关
const zoomAbout = {
  /** 初始化画布缩放相关事件 */
  initZoom: function () {
    // 缩放相关
    this.paperZoom = 100
    // 当前缩放序列
    this.scaleIndex = 6
    // 缩放范围
    this.scaleValues = [25, 33, 50, 67, 75, 90, 100, 110, 125, 150, 175, 200]

    // 画布缩放
    this.dispatcher.on('paper:zoom', this.doZoom, this)
    this.paper.on('scale', this.paperScale, this)
    this.dispatcher.on('paper:fit', this.fitContent, this)
  },
  paperScale: function (t) {
    this.paperZoom = 100 * t
    this.dispatcher.trigger('paper:scale', t)
  },
  doZoom: function (ifZoomOut) {
    var that = this
    if (this.scaleIndex < 0) {
      var i = _.findIndex(this.scaleValues, function (t, i) {
        return t >= that.paperZoom
      })
      this.scaleIndex = ifZoomOut ? i : i - 1
    }
    if (ifZoomOut && this.scaleIndex > 0) {
      this.scaleIndex -= 1
    }
    if (!ifZoomOut && this.scaleIndex < this.scaleValues.length - 1) {
      this.scaleIndex += 1
    }
    if (this.paperZoom !== this.scaleValues[this.scaleIndex]) {
      this.paperZoom = this.scaleValues[this.scaleIndex]
      this.paper.scale(this.paperZoom / 100, this.paperZoom / 100)
    }
  },
  fitContent: function () {
    this.paper.scaleContentToFit({
      padding: 40,
      minScaleX: 0.5,
      maxScaleX: 2,
      minScaleY: 0.5,
      maxScaleY: 2,
    })
    this.scaleIndex = -1
  },
}
// 画布拖拽相关
const dragAbout = {
  initDrag: function () {
    this.doDrag = false
    this.originX = 0
    this.originY = 0
    this.paper.on('translate', this.paperTranslate, this)
    this.paper.on('blank:pointerdown', this.canvasMouseDown, this)
    this.paper.on('blank:pointerup', this.canvasMouseUp, this)
    this.paper.$el.on('mousemove', _.bind(this.onMouseMove, this))
  },
  paperTranslate: function (x, y) {
    this.originX = x
    this.originY = y
  },
  startDrag: function (t) {
    this.doDrag = true
  },
  stopDrag: function () {
    this.doDrag = false
    this.fromX = null
    this.fromY = null
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
      this.dispatcher.trigger('code:update')
    }
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
  clearSelector: function () {
    if (this.active_link) {
      this.selector.remove()
      this.active_link = null
      $('div.tooltip').stop(true, false).fadeOut(200, function () {
        $(this).remove()
      })
    }
  },
}
// 多选节点相关
const selectionAbout = {
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
    // TODO 找下下面两个函数是什么作用
    // this.selection.on('selection-box:pointerdown', _.bind(this.selectionMouseDown, this))
    // this.selection.on('action:remove:pointerdown', _.bind(this.removeSelected, this))
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
}
// 添加节点相关
const addBlockAbout = {
  /** 挂载自定义节点 */
  mountJointNodes: function () {
    joint.shapes['coa'] = {}
    joint.shapes['coa'].Selector = SelectorModel
    joint.shapes['coa'].SelectorView = SelectorView
    joint.shapes['coa'].Intro = IntroModel
    joint.shapes['coa'].IntroView = IntroView

    joint.shapes['coa'].StartEnd = StartEndModel
    joint.shapes['coa'].StartEndView = StartEndView
    joint.shapes['coa'].Action = ActionModel
    joint.shapes['coa'].ActionView = ActionView
    joint.shapes['coa'].Filter = FilterModel
    joint.shapes['coa'].FilterView = FilterView
    joint.shapes['coa'].Decision = DecisionModel
    joint.shapes['coa'].DecisionView = DecisionView
  },
  /** 初始化节点添加函数 */
  initAddBlockFunctions: function () {
    // TODO 恢复其他节点
    this.addBlockFunctions = {
      action: _.bind(this.addAction, this),
      filter: _.bind(this.addFilter, this),
      decision: _.bind(this.addDecision, this),
    }
  },
  addBlock: function (t) {
    if (
      this.addBlockFunctions.hasOwnProperty(t) &&
      this.addBlockFunctions[t]
    ) {
      this.addBlockFunctions[t]()
      this.dispatcher.trigger('playbook:change:code')
    } else {
      console.error('Block type "' + t + '" not implemented.')
    }
  },
  _addBlock: function (node) {
    const position = this.selector.get('position')
    node.position(position.x, position.y - 40)
    this.blocks.getActiveId() && this.resetSelection()
    this.blocks.push(node)
    this.graph.addCell([ node ])
    this.active_link && this.active_link.model.set('target', {
      id: node.id,
      selector: '.port-body[type="input"]',
    })
    const length = this.blocks.length
    node.set('order', length - 1)
    this.endBlock.set('order', length)
    this.collectBlockData(node)
    this.clearSelector()
  },
  removeAction: function (model) {
    const node = this.paper.findViewByModel(model)
    const action = model.get('action')

    this.resetSelection()
    this.blocks.remove(model)
    this.graph.removeLinks(model)

    const cells = this.graph.get('cells')
    this.graph.resetCells(_.filter(cells.models, function (e) {
      return e.id !== model.id
    }))
    node.remove()
    this.blockCleanup(model, action)
    this.dispatcher.trigger('editor:close')
    this.dispatcher.trigger('code:update')
    this.dispatcher.trigger('playbook:change:code')
  },
  addAction: function () {
    const node = new ActionModel()
    const actionSelectMode = 'apps'
    this.coa.set('actionSelectState', actionSelectMode)
    this._addBlock(node)
    // active 变化触发 panels 更新
    node.set({
      active: true,
      state: actionSelectMode,
    })
  },
  // 添加Filter组件
  addFilter: function () {
    const node = new FilterModel()
    const number = this.getNextBlockNumber('filter')
    this._addBlock(node)
    node.set({
      number,
      active: true,
    })
  },
   // 添加Decision组件
   addDecision: function () {
    const node = new DecisionModel()
    const number = this.getNextBlockNumber('decision')
    this._addBlock(node)
    node.set({
      number,
      active: true,
    })
  },
}
// 节点数据处理相关
const blockDataAbout = {
  getNextBlockNumber: function (nodeType) {
    this.nameIndex.hasOwnProperty(nodeType)
      ? this.nameIndex[nodeType] += 1
      : this.nameIndex[nodeType] = 1
    return this.nameIndex[nodeType]
  },
  // 处理新的节点数据
  collectBlockData: function (node) {
    this.getSourceInputs(node)
    this.findBlockOutputs(node)
    this.getMenuData(node)
  },
  /** 向上回溯节点的调用链关系 */
  findBlockSource: function (node) {
    if (node.get('callsback')) {
      return {
        names: node.getBlockName(),
        callbacks: node.getCallbackName(),
        functions: node.getFunctionName(),
      }
    }
    const neighbor = this.graph.getNeighbors(node, {
      inbound: true,
    })
    const callsback = {
      names: [],
      callbacks: [],
      functions: [],
    }
    _.each(neighbor, (neNode) => {
      const cb = this.findBlockSource(neNode)
      callsback.names = callsback.names.concat(cb.names)
      callsback.callbacks = callsback.callbacks.concat(cb.callbacks)
      callsback.functions = callsback.functions.concat(cb.functions)
    })
    return callsback
  },
  // 处理上下游关系
  getSourceInputs: function (node) {
    const neighbor = this.graph.getNeighbors(node, {
      inbound: true,
    })
    let connection_type = ''
    let connection_name = ''
    const source = {
      names: [],
      callbacks: [],
      functions: [],
    }
    _.each(neighbor, (neNode) => {
      const cb = this.findBlockSource(neNode)
      source.names = source.names.concat(cb.names)
      source.callbacks = source.callbacks.concat(cb.callbacks)
      source.functions = source.functions.concat(cb.functions)
    })
    if (source.names.length > 0) {
      connection_type = source.names.length === 1 && source.names[0] === 'start'
        ? 'object'
        : 'action'
      connection_name = source.names.join(', ')
    }
    source.callbacks = _.compact(source.callbacks)
    source.functions = _.compact(source.functions)
    node.set({
      connection_type,
      connection_name,
    })
    node.inbound = source.functions
    node.inCount = neighbor.length
    if (
      neighbor.length === 1 &&
      node.get('type') === 'coa.Action' &&
      neighbor[0].get('type') === 'coa.Action'
    ) {
      node.parent_action = true
    }
  },
  findBlockOutputs: function (t) {
    const connected = this.graph.getConnectedLinks(t, {
      outbound: true,
    })
    const outbound = []
    _.each(connected, function (conNode) {
      const model = conNode.getTargetElement()
      if (
        model !== null &&
        model.get('type') !== 'coa.Selector'
      ) {
        const ob = {
          type: model.get('type'),
          function_name: model.getCallbackName(),
          port: conNode.get('source').port,
        }
        ob.function_name !== null && outbound.push(ob)
      }
    })
    t.outbound = outbound
  },
  getMenuData: function (node) {
    // 找前任
    const pred = this.graph.getPredecessors(node, {
      breadthFirst: true,
    })
    const toStartArr = _.filter(pred, (pNode) => {
      return pNode.get('type') === 'coa.StartEnd'
    })
    const connected_to_start = toStartArr.length > 0
    var parameters = []
    if (connected_to_start) {
      const menuData = toStartArr[0].getMenuData(node, this.graph)
      parameters = parameters.concat(menuData)
    }

    if (
      node.get('type') === 'coa.Filter' ||
      node.get('type') === 'coa.Decision'
    ) {
      // const clMenu = this.getCustomListMenu()
      // const dtMenu = this.getDateTimeMenu()
      // parameters = parameters.concat(clMenu)
      // parameters = parameters.concat(dtMenu)
    }

    _.each(pred.reverse(), (pNode) => {
      if (pNode.get('type') !== 'coa.StartEnd') {
        const menuData = pNode.getMenuData(node, this.graph)
        if (menuData.length > 0) {
          parameters = parameters.concat(menuData)
        }
      }
    })
    node.set({
      connected_to_start,
      parameters: parameters.reverse(),
    })
  },
  updateAllConnections: function () {
    var sources = this.graph.getSources()
    _.each(sources, (soItem) => {
      const successors = this.graph.getSuccessors(soItem, {
        breadthFirst: true,
      })
      this.getSourceInputs(soItem)
      this.findBlockOutputs(soItem)
      _.each(successors, (suItem) => {
        this.getSourceInputs(suItem)
        this.findBlockOutputs(suItem)
      })
    })
  },
  blockCleanup: function (model, action) {
    const functionName = model.getFunctionName()
    delete this.nameIndex[functionName]
    const type = model.get('type')
    if (type === 'coa.Action') {
      this.setShowActionNumber(action)
    } else if (
      type === 'coa.Filter' &&
      model.get('number') === this.nameIndex.filter
    ) {
      this.nameIndex.filter -= 1
    }
    this.updateBlockOrder()
  },
  updateBlockOrder: function () {
    let order = 2
    _.each(this.blocks.models, function (mod) {
      if (mod.get('type') !== 'coa.StartEnd') {
        mod.set('order', order)
        order += 1
      }
    })
    this.startBlock.set('order', 1)
    this.endBlock.set('order', this.blocks.length)
  },
  setShowActionNumber: function (action) {
    var actionNodes = this.blocks.where({
      type: 'coa.Action',
      action,
    })
    if (actionNodes.length > 1) {
      _.each(actionNodes, (t) => {
        t.set('show_number', true)
      })
    } else if (actionNodes.length === 1) {
      actionNodes[0].set('show_number', false)
    }
  },
}

export default Backbone.View.extend({
  el: id,
  events: {
    mouseup: 'stopDrag',
    mouseleave: 'stopDrag',
  },
  initialize ({ mainId }) {
    this.container = $(`#${mainId}`)
    this.fromX = null
    this.fromY = null
    this.nameIndex = {}

    this.mountJointNodes()
    this.initJointInstance()
    this.initSelector()
    this.initAddBlockFunctions()
    this.initEvent()
    this.initZoom()
    this.initDrag()
    this.render()
  },
  render () {
    const that = this
    const json = this.playbook.get('json')

    if (this.playbook.get('id') === '') {
      // 初始化默认内容
      const startBlock = new StartEndModel('start', '开始')
      startBlock.position(100, 100)
      startBlock.set('outPorts', ['out'])
      startBlock.set({
        state: 'start',
        status: '',
        order: 1,
      })
      this.blocks.add(startBlock)

      const endBlock = new StartEndModel('end', '结束')
      endBlock.position(640, 100)
      endBlock.set('inPorts', ['in'])
      endBlock.set({
        state: 'end',
        status: '',
        order: 2,
      })
      this.blocks.add(endBlock)

      // 操作提示控件
      const intro = new IntroModel()
      intro.position(220, 60)

      this.startBlock = startBlock
      this.endBlock = endBlock
      this.intro = intro
      this.graph.addCell([startBlock, endBlock, intro])
      $(`${id} g.start`).addClass('pulse')
    } else if (
      json &&
      json.joint &&
      json.joint.cells.length > 0
    ) {
      const cells = []
      const links = []

      _.each(_.sortBy(json.joint.cells, 'order'), (cell) => {
        const type = cell.type

        switch (type) {
          case 'link':
            links.push(new joint.dia.Link(cell))
            break
          case 'coa.Action':
            const nodeAction = new ActionModel(cell)
            nodeAction.position(cell.position.x, cell.position.y)
            nodeAction.set({
              status: 'warn',
              active: true,
            })

            cells.push(nodeAction)
            that.blocks.add(nodeAction, { silent: true })
            break
          case 'coa.Filter':
            const nodeFilter = new FilterModel(cell)

            nodeFilter.position(cell.position.x, cell.position.y)
            nodeFilter.set({
              status: 'warn',
              active: true,
            })

            cells.push(nodeFilter)
            that.blocks.add(nodeFilter, { silent: true })
            break
          case 'coa.Decision':
            const nodeDecision = new DecisionModel(cell)

            nodeDecision.position(cell.position.x, cell.position.y)
            nodeDecision.set({
              status: 'warn',
              active: true,
            })

            cells.push(nodeDecision)
            that.blocks.add(nodeDecision, { silent: true })
            break
          case 'coa.StartEnd':
            const nodeStartEnd = new StartEndModel(cell.blockType, cell.title)
            nodeStartEnd.position(cell.position.x, cell.position.y)
            nodeStartEnd.set({
              id: cell.id,
              z: cell.z,
              outPorts: cell.outPorts,
              inPorts: cell.inPorts,
              custom_code: cell.custom_code,
            })
            if (cell.blockType === 'start') {
              that.startBlock = nodeStartEnd
            } else {
              that.endBlock = nodeStartEnd
            }

            cells.push(nodeStartEnd)
            that.blocks.add(nodeStartEnd, { silent: true })
            break

          default:
            break
        }
      })

      this.graph.addCell(cells)
      this.graph.addCell(links)
      this.updateBlockOrder()
    }

    this.loaded = true

    if (this.coa.get('editMode')) {
      this.setEditMode()
    } else {
      this.setViewMode()
    }

    return this
  },

  /// ----以下是自定义方法----

  /** 初始化jointjs实例 */
  initJointInstance () {
    this.graph = new joint.dia.Graph()
    this.paper = new joint.dia.Paper({
      el: $(id),
      model: this.graph,
      width: '100%',
      height: '100%',
      multiLinks: false,
      perpendicularLinks: true,
      snapLinks: {
        radius: 50,
      },
      drawGrid: true,
      gridSize: config.gridSize,
      clickThreshold: 10,
      cellViewNamespace: joint.shapes,
      linkView: joint.dia.LinkView.extend({
        options: _.defaults({
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
            fill: '#797979', // 填充色
            stroke: '#797979', // 边框色
          },
          '.connection': {
            stroke: '#797979',
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
  // 初始化事件
  initEvent: function () {
    this.paper.on('link:connect', this.changeConnection, this)
    this.paper.on('cell:pointerclick', this.cellMouseClick, this)
    this.paper.on('cell:pointerdown', this.cellMouseDown, this)
    this.paper.on('cell:pointerup', this.cellMouseUp, this)
    this.dispatcher.on('panel:close', this.resetSelection, this)
    // 添加节点
    this.dispatcher.on('block:add', this.addBlock, this)
    // 手动移除介绍节点
    this.dispatcher.on('intro:remove', this.removeIntro, this)
    // 移除节点
    this.dispatcher.on('action:delete', this.removeAction, this)

    this.listenTo(this.coa, 'change:panelOpen', this.slideCanvas)
    this.listenTo(this.dispatcher, 'code:global', this.resetSelection)
    this.listenTo(this.blocks, 'change:position', this.removeIntro)

    this.listenTo(this.playbook, 'change:clean', this.cleanState)
    this.listenTo(this.dispatcher, 'mode:view', this.setViewMode)
    this.listenTo(this.dispatcher, 'mode:edit', this.setEditMode)
  },

  ...zoomAbout,
  ...dragAbout,
  ...selectionAbout,
  ...addBlockAbout,
  ...blockDataAbout,

  removeIntro: function () {
    var that = this
    if (this.intro) {
      var e = this.paper.findViewByModel(this.intro)
      $(`${id} g.joint-type-coa-intro`).animate({
        opacity: 0,
      }, 200, function () {
        e.remove()
        that.intro.remove()
        $(`${id} g.start`).removeClass('pulse')
      })
    }
  },
  changeConnection: function (target) {
    this.removeIntro()
    var e = this.graph.getCell(target.model.get('target').id)
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

  cleanState: function (t, state) {
    state ? this.setEditMode() : this.setViewMode()
  },
  setViewMode: function () {
    if (!this.playbook.get('clean')) {
      this.paper.$el.addClass('dirty')
      this.paper.$el.css('pointer-events', 'none')
    }
    this.paper.$el.addClass('disabled')
    this.paper.setInteractivity(false)
  },
  setEditMode: function () {
    if (this.playbook.get('clean')) {
      this.paper.$el.removeClass('dirty')
      this.paper.$el.removeClass('disabled')
      this.paper.$el.css('pointer-events', 'all')
      this.paper.setInteractivity(!0)
      if (['block', 'callback', 'join'].indexOf(this.coa.get('codeView')) !== -1) {
        var t = this.blocks.lastActive
          ? this.blocks.lastActive
          : this.startBlock
        t.set({ active: true })
      }
      this.updateAllConnections()
      _.invoke(this.blocks.models, 'generateMenuData')
      this.validateBlockConfig()
    }
  },

  slideCanvas: function (t, e) {
    if (e) {
      const blockX = this.coa.get('blockX')
      if (blockX + this.originX < 380) {
        const moveX = 380 - (blockX + this.originX)
        this.slideSpeed = moveX / 20
        this.slideEnd = moveX + this.originX
        this.handleSlide()
      }
    }
  },
  handleSlide: function () {
    if (this.slideEnd > this.originX) {
      var t = this.originX + this.slideSpeed > this.slideEnd
        ? this.slideEnd - this.originX
        : this.slideSpeed
      var e = this.paper.translate()
      this.slideCurrent += t
      this.paper.translate(t + this.originX, e.ty)
      this.slideTimer = window.setTimeout(_.bind(this.handleSlide, this), 10)
    }
  },

  /** 点击节点 */
  cellMouseClick: function (target, event) {
    const blockNow = this.blocks.getActive()
    this.dispatcher.trigger('body:click')
    this.clearSelector()
    if (target.model !== blockNow) {
      this.resetSelection()
      if (
        !event.metaKey &&
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
    }
  },
  /** 节点-鼠标按下 */
  cellMouseDown: function (t, e, i, n) {
    $(e.target).is('circle') && this.removeIntro()
  },
  /** 节点-鼠标松开 */
  cellMouseUp: function (t, event, i, n) {
    if (t.model.get('type') === 'link') {
      // 点击连接线
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
        event.stopPropagation()
      }
    } else if (
      this.coa.get('editMode') &&
      !this.coa.get('resolveOpen') &&
      (event.ctrlKey || event.metaKey) &&
      t.model.get('type') !== 'coa.Intro'
    ) {
      this.selection.collection.add(t.model)
      t.cellOut()
    }
  },
})
