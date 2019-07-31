/* eslint comma-dangle: ["error", "always-multiline"] */

// import * as joint from 'jointjs'
import {
  defaultsDeep,
  extend,
} from 'lodash'

import props from '../props.js'
import {
  Model,
  View,
} from './base.js'

const startWidth = props.gridSize * 4
const startHeight = props.gridSize * 3
const iconHeight = 13
const bottomIconY = startHeight - 17 - 10

export const StartEndModel = Model.extend(extend(
  {},
  {
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
      type: `${props.prefix}.StartEnd`,
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
          fill: props.headerBgColor,
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
          xlinkHref: `${props.imgPrefix}/icon_warn.png`,
          ref: '.background',
          refX: 54,
          refY: bottomIconY,
          width: 16,
          height: 16,
        },
        'g.icon image': {
          xlinkHref: `${props.imgPrefix}/icon_task.png`,
          ref: '.background',
          refX: 12,
          refY: 8,
          width: 13,
          height: iconHeight,
        },
        'g.code image': {
          xlinkHref: `${props.imgPrefix}/icon_compile.png`,
          ref: '.background',
          refX: 12,
          refY: bottomIconY,
          width: 17,
          height: 17,
        },
        '.inPorts circle': {
          type: 'input',
          ref: '.background',
          refY: props.gridSize,
        },
        '.outPorts circle': {
          type: 'output',
          ref: '.background',
          refX: startWidth,
          refY: props.gridSize,
        },
      },
    }, Model.prototype.defaults),

    initialize: function (t) {
      Model.prototype.initialize.apply(this, arguments)
    },
  }
))

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
