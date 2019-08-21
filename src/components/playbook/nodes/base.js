/* eslint comma-dangle: ["error", "always-multiline"] */

import * as joint from 'jointjs'
import {
  defaultsDeep,
  each,
  extend,
  filter,
  keys,
  omit,
} from 'lodash'

joint.shapes.basic.PortsModelInterface = {
  initialize: function () {
    this.updatePortsAttrs()
    this.on(
      'change:inPorts change:outPorts',
      this.updatePortsAttrs,
      this,
    )
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

joint.shapes.basic.PortsViewInterface = {
  initialize: function () {
    this.listenTo(this.model, 'process:ports', this.update)
    joint.dia.ElementView.prototype.initialize.apply(this, arguments)
  },
  update: function () {
    this.renderPorts()
    joint.dia.ElementView.prototype.update.apply(this, arguments)
  },
  renderPorts: function () {
    var nodeIn = this.$('.inPorts').empty()
    var nodeOut = this.$('.outPorts').empty()
    var renderFunc = joint.util.template(this.model.portMarkup)
    each(filter(this.model.ports, function (t) {
      return t.type === 'in'
    }), function (port, id) {
      nodeIn.append(joint.V(renderFunc({
        id: id,
        port: port,
      })).node)
    })
    each(filter(this.model.ports, function (t) {
      return t.type === 'out'
    }), function (port, id) {
      nodeOut.append(joint.V(renderFunc({
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

export const Model = joint.shapes.basic.Generic.extend(extend(
  {},
  joint.shapes.basic.PortsModelInterface,
  {
    markup: '',
    portMarkup: `<g class="port port-<%= id %>">
  <circle class="port-body"/>
  <text class="port-label"/>
</g>`,
    defaults: defaultsDeep({
      type: 'coa.Base',
    }, joint.shapes.devs.Model.prototype.defaults),

    initialize: function () {
      joint.shapes.basic.PortsModelInterface.initialize.apply(this, arguments)
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
  },
))

export const View = joint.dia.ElementView.extend(extend(
  {},
  joint.shapes.basic.PortsViewInterface,
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
      mouseenter: 'cellOver',
      mouseleave: 'cellOut',
    },
    extraEvents: {},
    initialize: function () {
      joint.dia.ElementView.prototype.initialize.apply(this, arguments)
      joint.shapes.basic.PortsViewInterface.initialize.apply(this, arguments)
    },
    events: function () {
      return extend({}, this.baseEvents, this.extraEvents)
    },
  },
))
