const template = `<g class="rotatable">
  <g class="inPorts"/><g class="outPorts"/>
  <g class="scalable"></g>
  <circle class="dot"></circle>
  <circle class="glow"></circle>
</g>
`

export const SelectorModel = joint.shapes.basic.Generic.extend({
  markup: template,
  defaults: _.defaultsDeep({
    type: 'coa.Selector',
    size: {
      width: 40,
      height: 40,
    },
    attrs: {
      '.': {
        magnet: false,
      },
      '.port-body': {
        r: 10,
        magnet: true,
      },
      'circle.dot': {
        cx: -20,
        cy: 0,
        r: 8,
      },
      'circle.glow': {
        cx: -20,
        cy: 0,
        r: 20,
      },
    },
  }, joint.shapes.basic.Generic.prototype.defaults),
  initialize: function () {
    joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments)
  },
})

export const SelectorView = joint.dia.ElementView.extend({
  initialize: function () {
    joint.dia.ElementView.prototype.initialize.apply(this, arguments)
  },
  pointerdown: function (t, e, i) {},
})
