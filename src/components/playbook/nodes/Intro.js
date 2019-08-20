/* eslint comma-dangle: ["error", "always-multiline"] */

import * as joint from 'jointjs'

export const IntroModel = joint.shapes.basic.Generic.extend({
  markup: `<g class="rotatable">
  <g class="scalable"></g>
  <rect class="arrow"/>
  <rect class="background"/>
  <rect class="button"/>
  <text class="title"/>
  <text class="directions"/>
  <text class="close"/>
</g>
`,
  defaults: joint.util.deepSupplement({
    type: 'cmChart.Intro',
    size: {
      width: 294,
      height: 108,
    },
    attrs: {
      '.arrow': {
        fill: 'green',
        width: 16,
        height: 16,
        transform: 'rotate(45)',
        x: 42,
        y: 27,
      },
      '.background': {
        fill: 'green',
        width: 294,
        height: 108,
        x: 10,
        y: 0,
      },
      '.button': {
        fill: '#ffffff',
        width: 78,
        height: 26,
        rx: 3,
        ry: 3,
        x: 30,
        y: 65,
      },
      'text.title': {
        fontSize: 12,
        fontFamily: 'Roboto',
        fontWeight: 500,
        text: 'Getting Started',
        refX: 30,
        refY: 16,
      },
      'text.directions': {
        fontSize: 12,
        fontFamily: 'Roboto',
        fontWeight: 300,
        text: 'Drag and release green node to get started.',
        refX: 30,
        refY: 34,
      },
      'text.close': {
        fill: '#333333',
        fontSize: 12,
        fontFamily: 'Roboto',
        fontWeight: 700,
        text: 'GOT IT',
        yAlignment: 'middle',
        xAlignment: 'middle',
        ref: '.button',
        refX: 0.5,
        refY: 0.5,
      },
    },
  }, joint.shapes.devs.Model.prototype.defaults),
  initialize: function () {
    joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments)
  },
})

export const IntroView = joint.dia.ElementView.extend({
  events: {
    'click .button': 'removeIntro',
  },
  initialize: function () {
    joint.dia.ElementView.prototype.initialize.apply(this, arguments)
    this.options.interactive = false
  },
  removeIntro: function () {
    this.dispatcher.trigger('intro:remove')
  },
  pointerdown: function (t, e, i) {},
})
