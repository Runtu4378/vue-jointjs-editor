/* eslint comma-dangle: ["error", "always-multiline"] */

import _ from 'underscore'
import $ from 'jquery'
import {
  dia,
  util,
  shapes,
  V,
} from 'jointjs'
import {
  defaultsDeep,
  each,
  extend,
  filter,
  keys,
  omit,
} from 'lodash'

shapes.basic.PortsModelInterface = {
  initialize: function () {
    this.updatePortsAttrs()
    this.on('change:inPorts change:outPorts', this.updatePortsAttrs, this)
    this.constructor.__super__.constructor.__super__.initialize.apply(this, arguments)
  },
  updatePortsAttrs: function (t) {
    if (this._portSelectors) {
      var e = omit(this.get('attrs'), this._portSelectors)
      this.set('attrs', e, {
        silent: true,
      })
    }
    this._portSelectors = []
    const attrSet = {}
    each(this.get('inPorts'), (t, e, s) => {
      var o = this.getPortAttrs(t, e, s.length, '.inPorts', 'in')
      this._portSelectors = this._portSelectors.concat(keys(o))
      extend(attrSet, o)
    })
    each(this.get('outPorts'), (t, e, s) => {
      var o = this.getPortAttrs(t, e, s.length, '.outPorts', 'out')
      // console.log(o)
      this._portSelectors = this._portSelectors.concat(keys(o))
      extend(attrSet, o)
    })
    // console.log(i)
    this.attr(attrSet, {
      silent: true,
    })
    this.processPorts()
    this.trigger('process:ports')
  },
  getPortSelector: function (t) {
    let selector = '.inPorts'
    let idx = this.get('inPorts').indexOf(t)
    if (
      idx < 0 &&
      (
        selector = '.outPorts',
        idx = this.get('outPorts').indexOf(t),
        idx < 0
      )
    ) {
      throw new Error('getPortSelector(): Port doesn\'t exist.')
    }
    return selector + '>g:nth-child(' + (idx + 1) + ')>.port-body'
  },
}

shapes.basic.PortsViewInterface = {
  initialize: function () {
    this.listenTo(this.model, 'process:ports', this.update)
    dia.ElementView.prototype.initialize.apply(this, arguments)
  },
  update: function () {
    this.renderPorts()
    dia.ElementView.prototype.update.apply(this, arguments)
  },
  renderPorts: function () {
    var nodeIn = this.$('.inPorts').empty()
    var nodeOut = this.$('.outPorts').empty()
    var renderFunc = util.template(this.model.portMarkup)
    each(filter(this.model.ports, function (t) {
      return t.type === 'in'
    }), function (port, id) {
      nodeIn.append(V(renderFunc({
        id: id,
        port: port,
      })).node)
    })
    each(filter(this.model.ports, function (t) {
      return t.type === 'out'
    }), function (port, id) {
      nodeOut.append(V(renderFunc({
        id: id,
        port: port,
      })).node)
    })
  },
}

window.PLAYBOOK_THEME = 'light'

export const defaultProps = {
  /** 栅格大小 */
  gridSize: 20,

  /** 主题 */
  theme: 'light',

  /** 图片前缀 */
  imgPrefix: '/joi/img',

  /** header相关设置 */
  headerHeight: 28,
  headerIconPadding: 12,
  headerFontSize: 12,
  headerBgColor: '#161B1E',

  /** 端点配置 */
  portBgColor: '#51B252',
}

export const Model = shapes.basic.Generic.extend(extend(
  {},
  shapes.basic.PortsModelInterface,
  {
    markup: '',
    portMarkup: `<g class="port port-<%= id %>">
  <circle class="port-body"/>
  <text class="port-label"/>
</g>`,
    defaults: defaultsDeep({
      type: 'coa.Base',
      name: '',
      active: false,
      warn: false,
      order: 0,
      number: 0,
      connected_to_start: true,
    }, shapes.devs.Model.prototype.defaults),

    initialize: function () {
      this.menuData = []
      this.listenTo(this, 'change', this.generateMenuData)
      shapes.basic.PortsModelInterface.initialize.apply(this, arguments)
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

    generateMenuData: function () {},
    getMenuData: function (t, e) {
      return this.menuData
    },
    getFunctionName: function () {
      var t = this.get('name')
      if (this.get('custom_name') !== '') {
        t = this.get('custom_name')
      } else {
        t += ' ' + this.get('number')
      }
      if (t) {
        t = t.replace(/[^a-zA-Z0-9_]/g, ' ')
        t = util.trim(t)
        t = t.replace(/\s+/g, '_')
      }
      return t
    },
    blockOver: function () {
      this.attr('g.delete/display', 'block')
    },
    blockOut: function () {
      this.attr('g.delete/display', 'none')
    },
  },
))

export const View = dia.ElementView.extend(extend(
  {},
  shapes.basic.PortsViewInterface,
  {
    baseEvents: {
      'click .delete': 'confirmDelete',
      'click .code': 'openEditor',
      'click .timer': 'showSettings',
      'click .approver': 'showSettings',
      'click .notes': 'showGeneral',
      'click .name': 'showGeneral',
      'mouseenter .delete': 'deleteOver',
      'mouseleave .delete': 'deleteOut',
      'mouseenter .notes': 'showNoteTip',
      'mouseleave .notes': 'hideBlockTip',
      'mouseenter .error': 'showErrorTip',
      'mouseleave .error': 'hideBlockTip',
      'mouseenter': 'cellOver',
      'mouseleave': 'cellOut',
    },
    extraEvents: {},
    initialize: function () {
      this.deleteTitle = 'Delete block?'
      this.deleteMessage = 'This will remove the block and associated data.'
      this.listenTo(this.model, 'change:title', this.updateTitle)
      this.listenTo(this.model, 'change:custom_name', this.updateNameDisplay)

      dia.ElementView.prototype.initialize.apply(this, arguments)
      shapes.basic.PortsViewInterface.initialize.apply(this, arguments)
    },
    events: function () {
      return extend({}, this.baseEvents, this.extraEvents)
    },

    confirmDelete: function (t) {
      t.stopPropagation()
      if (this.coa.get('editMode')) {
        var e = {
          title: this.deleteTitle,
          message: this.deleteMessage,
        }
        var i = _.bind(this.deleteBlock, this)
        this.dispatcher.trigger('alert:show', e, {
          callback: i,
        })
      }
    },
    deleteBlock: function () {
      this.dispatcher.trigger('action:delete', this.model)
    },
    showSettings: function () {
      this.coa.get('editMode') && this.coa.set('openSettings', 'action')
    },
    showGeneral: function () {
      this.coa.get('editMode') && this.coa.set('openSettings', 'general')
    },
    updateTitle: function (t, e) {
      this.model.get('active') && this.updateState(t, !0)
    },
    updateState: function (t, e) {
      e ? this.$el.addClass('active') : this.$el.removeClass('active')
    },
    updateNameDisplay: function (t, e) {
      var i = this.model.getFunctionName()
      if (this.model.get('previous_name') !== i) {
        this.dispatcher.trigger('action:name', this.model.get('previous_name'), i)
        this.model.set('previous_name', i)
      }
      this.dispatcher.trigger('code:update')
    },
    openEditor: function () {
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
    showTooltip: function (t) {
      var e = ($(t.currentTarget), this.model.getDisplayName())
      var i = 'top'
      this.tooltip = $('<div/>')
        .addClass('tooltip selector shadow ' + i)
        .css({
          display: 'none',
        })
      this.tooltip.append('<h5>' + e + '</h5>')
      this.tooltip.data('dir', i)
      $('body').append(this.tooltip)
      this.positionTooltip(t)
      this.tooltip.delay(1e3).fadeIn(200)
      this.$el.on('mousemove', _.bind(this.positionTooltip, this))
    },
    hideTooltip: function (t) {
      this.$el.off('mousemove')
      this.tooltip.stop(!0, !1).fadeOut(200, function () {
        $(this).remove()
      })
    },
    positionTooltip: function (t) {
      var e = t.pageY
      var i = t.pageX
      var n = this.tooltip.height()
      var s = this.tooltip.width()
      e -= n + 50
      i -= s / 2 + 20
      this.tooltip.css({
        top: e,
        left: i,
      })
    },
    showNoteTip: function (t) {
      var e = this.model.escape('notes')
      var i = new RegExp('\\n', 'g')
      if (e !== '') {
        e = e.replace(i, '<br/>')
        this.showBlockTip(e, t)
      }
    },
    showErrorTip: function (t) {
      if (!(this.model.get('active') || this.model.errors === 0 && this.model.warnings.length === 0)) {
        var e = '<ul>'
        this.model.errors > 0 && (e += '<li><i class="fa fa-warning error"></i>Python error on line ' + this.model.errors + '</li>')
        e += _.map(this.model.warnings, function (t) {
          return '<li><i class="fa fa-warning warn"></i>' + t + '</li>'
        }).join('') + '</ul>'
        this.showBlockTip(e, t)
      }
    },
    showBlockTip: function (t, e) {
      var i = e.pageX + 300 < $(window).width() ? 'right' : 'left'
      // new RegExp('\\n', 'g');
      this.blocktip = $('<div/>').addClass('tooltip confined selector shadow ' + i).css({
        display: 'none',
      })
      this.blocktip.append('<span>' + t + '</span>')
      this.blocktip.data('dir', i)
      $('body').append(this.blocktip)
      this.blocktip.delay(300).fadeIn(200)
      this.$el.on('mousemove', _.bind(this.positionBlockTip, this))
    },
    hideBlockTip: function (t) {
      this.blocktip && (this.$el.off("mousemove"), this.blocktip.stop(!0, !1).fadeOut(200, function () {
        $(this).remove()
      }))
    },
    positionBlockTip: function (t) {
      var e = t.pageY,
        i = t.pageX,
        n = this.blocktip.height(),
        s = this.blocktip.width(),
        o = this.blocktip.data("dir");
      "left" === o ? (e -= n / 2 + 15, i -= s + 65) : (e -= n / 2 + 15, i += 25), this.blocktip.css({
        top: e,
        left: i
      })
    },
  },
))
