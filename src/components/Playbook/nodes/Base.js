import './init'

const portTemplate = '<g class="port port-<%= id %>"><circle class="port-body"/><text class="port-label"/></g>' // 这不能有换行符

// 基础节点model
export const Model = joint.shapes.basic.Generic.extend(_.extend(
  {},
  joint.shapes.basic.PortsModelInterface,
  {
    markup: '',
    portMarkup: portTemplate,
    defaults: _.defaultsDeep({
      type: 'coa.Base',

      name: '', // 节点名称
      active: false,
      warn: false,
      order: 0,
      number: 0, // 该种节点已有的数量
      connected_to_start: true,
      show_number: true,
      callsback: false,
      join_optional: [],
      custom_join: '',
    }, joint.shapes.devs.Model.prototype.defaults),

    initialize: function () {
      // 初始化数据结构
      this.cached = false
      this.parameters = []
      this.inbound = []
      this.outbound = []
      this.inCount = 0
      this.errors = 0
      this.warnings = []
      this.field_warnings = []
      this.menuData = []

      this.initEvent()

      this.attr('g.delete/display', 'none')

      joint.shapes.basic.PortsModelInterface.initialize.apply(this, arguments)
    },

    initEvent: function () {
      // 初始化事件
      this.listenTo(this, 'change:position', this.markPropsChange)
      this.listenTo(this, 'change', this.generateMenuData)
    },

    getPortAttrs: function (id, e, length, parentClass, type) {
      const attrs = {}
      const idSelector = 'port-' + id
      const idsSelector = parentClass + '>.' + idSelector
      const ports = idsSelector + '>.port-body'
      attrs[ports] = {
        port: {
          id: id,
          type: type,
        },
      }
      attrs[idsSelector] = {
        ref: '.background',
        refX: (e + 0.5) * (1 / length),
      }
      return attrs
    },

    generateMenuData: function () { },
    getMenuData: function (t, e) {
      return this.menuData
    },
    getCallbackName: function () {
      var t = this.getFunctionName() || ''
      this.inCount > 1 && (t = 'join_' + t)
      return t
    },
    getFunctionName: function () {
      let name = this.get('name')

      name += ' ' + this.get('number')

      if (name) {
        name = name.replace(/[^a-zA-Z0-9_]/g, ' ')
        name = _.trim(name)
        // 把空格替换为_
        name = name.replace(/\s+/g, '_')
      }

      return name
    },
    blockOver: function () {
      this.attr('g.delete/display', 'block')
    },
    blockOut: function () {
      this.attr('g.delete/display', 'none')
    },
    deleteOut: function () {
      this.attr({
        'g.delete image': {
          opacity: 0.8,
        },
      })
    },
    deleteOver: function () {
      this.attr({
        'g.delete image': {
          opacity: 1,
        },
      })
    },
    toJSON: function () {
      var t = Model.__super__.toJSON.apply(this)
      delete t.parameters
      return t
    },
    formatName: function (t) {
      if (this.get('show_number')) {
        t += ' ' + this.get('number')
      }
      return t
    },
    markCodeChange: function () {
      this.dispatcher.trigger('playbook:change:code')
      this.errors > 0 && this.coa.set('errorLine', 0)
    },
    getBlockName: function () {
      var t = this.get('name')
      return this.formatName(t)
    },
    getBaseName: function () {
      var t = this.get('name')
      this.get('show_number') && (t += ' ' + this.get('number'))
      return t
    },
    getDisplayName: function () {
      const name = this.get('name')
      return this.formatName(name)
    },
    markPropsChange: function () {
      this.dispatcher.trigger('playbook:change:props')
    },
  },
))

export const View = joint.dia.ElementView.extend(_.extend(
  {},
  joint.shapes.basic.PortsViewInterface,
  {
    baseEvents: {
      'click .delete': 'confirmDelete',
      'click .code': 'openEditor',
      'mouseenter .delete': 'deleteOver',
      'mouseleave .delete': 'deleteOut',
      'mouseenter': 'cellOver',
      'mouseleave': 'cellOut',
    },
    extraEvents: {},
    initialize: function () {
      joint.dia.ElementView.prototype.initialize.apply(this, arguments)
      joint.shapes.basic.PortsViewInterface.initialize.apply(this, arguments)

      this.deleteTitle = '删除节点?'
      this.deleteMessage = '将删除节点及与其相关的数据.'

      this.listenTo(this.model, 'change:title', this.updateTitle)
    },
    events: function () {
      return _.extend({}, this.baseEvents, this.extraEvents)
    },

    confirmDelete: function (event) {
      event.stopPropagation()
      if (this.coa.get('editMode')) {
        const config = {
          title: this.deleteTitle,
          message: this.deleteMessage,
        }
        const callback = _.bind(this.deleteBlock, this)
        this.dispatcher.trigger('alert:show', config, { callback })
      }
    },
    deleteBlock: function () {
      this.dispatcher.trigger('action:delete', this.model)
    },
    updateTitle: function (t, e) {
      this.model.get('active') && this.updateState(t, !0)
    },
    updateState: function (t, e) {
      e ? this.$el.addClass('active') : this.$el.removeClass('active')
    },
    openEditor: function (event) {
      // TODO stopPropagation无效
      event.stopPropagation()
      this.dispatcher.trigger('editor:open')
    },
    deleteOver: function () {
      this.model.deleteOver()
    },
    deleteOut: function () {
      this.model.deleteOut()
    },
    cellOver: function () {
      this.coa.get('editMode') && this.model.get('type') !== 'coa.StartEnd' && this.model.blockOver()
    },
    cellOut: function () {
      this.model.blockOut()
      this.$el.find('.joint-highlight-stroke').remove()
    },
  },
))
