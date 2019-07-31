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
          fontFamily: 'Roboto',
          fontWeight: 400,
          text: '',
          width: 96,
          height: 20,
          ref: '.background',
          refY: 8,
          refX: 40,
          textAnchor: 'left',
          alignmentBaseline: 'central',
        },
        'g.error image': {
          xlinkHref: '',
          ref: '.background',
          refX: 54,
          refY: 20,
          width: 16,
          height: 13,
        },
        'g.icon image': {
          xlinkHref: '',
          ref: '.background',
          refY: 8,
          refX: 20,
          width: 13,
          height: 12,
        },
        'g.code image': {
          xlinkHref: '',
          ref: '.background',
          refY: 32,
          refX: 13,
          width: 17,
          height: 16,
        },
        '.inPorts circle': {
          type: 'input',
          ref: '.background',
          refY: 20,
        },
        '.outPorts circle': {
          type: 'output',
          ref: '.background',
          refX: 80,
          refY: 20,
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
