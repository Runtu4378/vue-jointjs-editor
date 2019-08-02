/* eslint comma-dangle: ["error", "always-multiline"] */
/* globals PLAYBOOK_THEME */

// import * as joint from 'jointjs'
import {
  defaultsDeep,
  // extend,
} from 'lodash'

import defaultProps from '../defaultProps'
import {
  Model,
  View,
} from './base.js'

const startWidth = defaultProps.gridSize * 4
const startHeight = defaultProps.gridSize * 3
const iconHeight = 13
const bottomIconY = startHeight - 17 - 10

export const StartEndModel = Model.extend({
  markup: `<g class="rotatable">
  <g class="inPorts"/><g class="outPorts"/>
  <g class="scalable"></g>
  <rect class="background"/>
  <rect class="color-band"/>
  <g class="icon"><image/></g>
  <text class="title"/>
  <g class="error"><image/></g>
  <g class="btn code"><image/></g>
</g>
`,
  portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
  defaults: defaultsDeep({
    type: `${defaultProps.prefix}.StartEnd`,
    name: '',
    size: {
      width: startWidth,
      height: startHeight,
    },
    inPorts: [],
    outPorts: [],
    attrs: {
      '.': {
        magnet: false,
      },
      '.port-body': {
        r: 10,
        magnet: true,
      },
      '.background': {
        fillOpacity: 1,
        strokeWidth: 2,
        stroke: '#5C606C',
        width: startWidth,
        height: startHeight,
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
      '.color-band': {
        fillOpacity: 1,
        fill: defaultProps.headerBgColor,
        x: 1,
        y: 1,
        width: 78,
        height: 27,
      },
      'text.title': {
        fill: '#FFFFFF',
        fontSize: 11,
        // fontFamily: 'Roboto',
        fontWeight: 400,
        text: '',
        width: 96,
        height: 20,
        ref: '.background',
        refY: 8,
        refX: 12 + 13 + 8,
        textAnchor: 'left',
        alignmentBaseline: 'central',
      },
      'g.error image': {
        xlinkHref: `${defaultProps.imgPrefix}/block_icon_error.svg`,
        ref: '.background',
        refX: 54,
        refY: bottomIconY,
        width: 16,
        height: 16,
      },
      'g.icon image': {
        xlinkHref: '',
        ref: '.background',
        refX: 12,
        refY: 8,
        width: 13,
        height: iconHeight,
      },
      'g.code image': {
        xlinkHref: `${defaultProps.imgPrefix}/block_icon_code_${PLAYBOOK_THEME}_off.svg`,
        ref: '.background',
        refX: 12,
        refY: bottomIconY,
        width: 17,
        height: 17,
      },
      '.inPorts circle': {
        type: 'input',
        ref: '.background',
        refY: defaultProps.gridSize,
        fill: defaultProps.portBgColor,
      },
      '.outPorts circle': {
        type: 'output',
        ref: '.background',
        refX: startWidth,
        refY: defaultProps.gridSize,
        fill: defaultProps.portBgColor,
      },
    },
  }, Model.prototype.defaults),

  initialize: function (title) {
    Model.prototype.initialize.apply(this, arguments)
    this.on('change:title', function (node, title) {
      node.attr('.title/text', title)
      if (title === 'START') {
        // 针对起点类型端点的配置
        node.attr({
          'g.icon image': {
            xlinkHref: `${defaultProps.imgPrefix}/block_icon_start.svg`,
            // refX: 13,
          },
        })
      } else {
        // 终点端点配置
        node.attr({
          'g.icon image': {
            xlinkHref: `${defaultProps.imgPrefix}/block_icon_end.svg`,
            // refX: 13,
          },
        })
      }
    })
    this.on('change:custom_code', function (node, code) {
      if (code === '') {
        node.attr({
          'g.code image': {
            xlinkHref: `${defaultProps.imgPrefix}/block_icon_code_${PLAYBOOK_THEME}_off.svg`,
          },
        })
      } else {
        node.attr({
          'g.code image': {
            xlinkHref: `${defaultProps.imgPrefix}/block_icon_code_${PLAYBOOK_THEME}_on.svg`,
          },
        })
        this.set('warn', false)
      }
    })
    this.set({
      title: title,
      name: '',
    })
  },
})

export const StartEndView = View.extend({
  initialize: function () {
    View.prototype.initialize.apply(this, arguments)
  },
  render: function () {
    View.prototype.render.call(this, arguments)
    // console.log(this.model.get('type'))
    // this.$el.addClass(this.model.get('title').toLowerCase())
  },
})
