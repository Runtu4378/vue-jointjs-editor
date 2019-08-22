/* eslint comma-dangle: ["error", "always-multiline"] */

import {
  defaultsDeep,
  extend,
} from 'lodash'

import {
  defaultProps,
  Model,
  View,
} from './base.js'

const itemWidth = defaultProps.gridSize * 9
const itemHeight = defaultProps.gridSize * 5

export const ActionModel = Model.extend(extend({}, {
  markup: `<g class="rotatable">
  <g class="inPorts"/><g class="outPorts"/>
  <g class="scalable"></g>
  <rect class="background"/>
  <rect class="color-band"/>
  <g class="icon"><image/></g>
  <text class="title"/>
  <rect class="status"/>
  <text class="message"/>
  <text class="number"/>
  <text class="action name"/>
  <g class="btn approver"><image/></g>
  <g class="btn timer"><image/></g>
  <g class="btn code"><image/></g>
  <g class="btn notes"><image/></g>
  <g class="btn delete"><image/><title>Delete action</title></g>
  <g class="error"><image/></g>
</g>
`,
  defaults: defaultsDeep({
    type: `${defaultProps.prefix}.Action`,
    size: {
      width: itemWidth,
      height: itemHeight,
    },
    inPorts: ['in'],
    outPorts: ['out'],
    attrs: {
      '.': {
        magnet: false,
      },
      '.port-body': {
        r: 10,
        magnet: true,
      },
      '.color-band': {
        fillOpacity: 1,
        x: 1,
        y: 1,
        width: 178,
        height: 29,
      },
      '.background': {
        fillOpacity: 1,
        strokeWidth: 2,
        width: itemWidth,
        height: itemHeight,
        x: 0,
        y: 0,
        rx: 3,
        ry: 3,
        filter: {
          name: 'dropShadow',
          args: {
            dx: 2,
            dy: 2,
            blur: 2,
            opacity: 0.3,
          },
        },
      },
      'text.title': {
        fill: '#FFFFFF',
        fontSize: 10,
        fontFamily: 'Roboto',
        fontWeight: 600,
        text: '',
        width: 104,
        height: 29,
        ref: '.background',
        refX: 28,
        refY: 11,
        textAnchor: 'left',
      },
      'g.error image': {
        xlinkHref: '',
        ref: '.background',
        refX: 154,
        refY: 80,
        width: 16,
        height: 13,
      },
      'text.number': {
        fill: '#FFFFFF',
        fontSize: 12,
        fontFamily: 'Roboto',
        fontWeight: 600,
        text: '',
        ref: '.rotatable',
        refY: 14,
        refX: 170,
        textAnchor: 'end',
      },
      'text.action': {
        fill: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Roboto',
        fontWeight: 300,
        text: '',
        width: 104,
        ref: '.background',
        height: 20,
        refY: 40,
        refX: 8,
        textAnchor: 'left',
      },
      '.status': {
        fill: '#0083FF',
        width: 99,
        height: 19,
        ref: '.background',
        refY: 102,
        refX: 0,
        rx: 3,
        ry: 3,
        opacity: 0,
      },
      'text.message': {
        fill: '#FFFFFF',
        fontSize: 12,
        fontFamily: 'Roboto',
        fontWeight: 300,
        ref: '.background',
        refY: 105,
        refX: 5,
        opacity: 0,
      },
      'g.icon image': {
        xlinkHref: '',
        ref: '.background',
        refY: 5,
        refX: 5,
        width: 20,
        height: 20,
      },
      'g.delete image': {
        xlinkHref: `${defaultProps.imgPrefix}/block_delete.svg`,
        ref: '.background',
        refY: -12,
        refX: 168,
        width: 26,
        height: 26,
        opacity: 0.8,
        filter: {
          name: 'dropShadow',
          args: {
            dx: 1,
            dy: 1,
            blur: 2,
            opacity: 0.2,
          },
        },
      },
      'g.approver image': {
        xlinkHref: `${defaultProps.imgPrefix}/block_icon_approver_${defaultProps.theme}_off.svg`,
        ref: '.background',
        refY: 78,
        refX: 11,
        width: 16,
        height: 16,
      },
      'g.timer image': {
        xlinkHref: `${defaultProps.imgPrefix}/block_icon_delay_${defaultProps.theme}_off.svg`,
        ref: '.background',
        refY: 78,
        refX: 35,
        width: 14,
        height: 15,
      },
      'g.code image': {
        xlinkHref: `${defaultProps.imgPrefix}/block_icon_code_${defaultProps.theme}_off.svg`,
        ref: '.background',
        refY: 78,
        refX: 58,
        width: 17,
        height: 13,
      },
      'g.notes image': {
        xlinkHref: `${defaultProps.imgPrefix}/block_icon_note_${defaultProps.theme}_off.svg`,
        ref: '.background',
        refY: 78,
        refX: 85,
        width: 12,
        height: 14,
      },
      '.port-body circle': {
        magnet: true,
      },
      '.inPorts circle': {
        type: 'input',
        ref: '.background',
        refY: defaultProps.gridSize * 2,
        fill: defaultProps.portBgColor,
      },
      '.outPorts circle': {
        type: 'output',
        ref: '.background',
        refX: itemWidth,
        refY: defaultProps.gridSize * 2,
        fill: defaultProps.portBgColor,
      },
    },

    name: 'action',
    state: 'action',

    app: '',
    show_number: false,
    message: '',
    approver: '',
    reviewer: '',

    delay: false,
    color: '',
    active_keys: {},
    active_values: {},
    required_params: {},
    callsback: true,
  }, Model.prototype.defaults),

  initialize: function () {
    Model.prototype.initialize.apply(this, arguments)

    this.on('change:title', function (node, title) {
      node.attr('.title/text', title)
    })
    this.on('change:color', function (node, color) {
      node.attr('.color-band/fill', color)
    })
    this.on('change:action', function (node, action) {
      node.attr('.action/text', action)
      node.set('previous_name', this.getFunctionName())
      node.set('name', action)
      // TODO 实现code绑定
      node.markCodeChange()
    })
    this.on('change:action_type', function (node, actionType) {
      var img = this.coa_settings.getBlockIcon(actionType)
      node.attr({
        'g.icon image': {
          xlinkHref: `${defaultProps.imgPrefix}/` + img,
        },
      })
    })

    this.attr('.color-band/fill', this.coa_settings.getBlockHeaderColor())
    this.attr('.background/fill', this.coa_settings.getBlockBackgroundColor())
    this.attr('.background/stroke', this.coa_settings.getBlockBorderColor())
    this.attr({
      '.status': {
        fill: '#0083FF',
        width: 99,
        height: 19,
        refY: 102,
        refX: 0,
      },
    })
    this.attr({
      '.message': {
        refY: 105,
        refX: 5,
      },
    })
  },
}))

export const ActionView = View.extend({
  initialize: function () {
    View.prototype.initialize.apply(this, arguments)
  },
  render: function () {
    View.prototype.render.call(this, arguments)
    // console.log(this.model.get('type'))
    // this.$el.addClass(this.model.get('title').toLowerCase())
  },
})
