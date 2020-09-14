import config from '../config'

const template = `
<div class="canvas-controls">
  <div class="zoom-fit"><i class="fa fa-expand"></i></div>
  <div class="zoom-minus"><i class="fa fa-minus"></i></div>
  <div class="zoom-plus HIDD"><i class="fa fa-plus"></i></div>
  <div class="zoom-level">100%</div>
</div>
`

export default Backbone.View.extend({
  el: `#${config.layouts.headerId}`,
  events: {
    'click .zoom-plus': 'zoomIn',
    'click .zoom-minus': 'zoomOut',
    'click .zoom-fit': 'zoomFit',
  },
  initialize: function () {
    this.template = _.template(template)

    this.listenTo(this.dispatcher, 'paper:scale', this.onScale)

    this.render()
  },
  render: function () {
    this.$el.html(this.template())

    return this
  },

  onScale: function (percent) {
    var e = Math.floor(100 * percent) + '%'
    this.$el.find('.zoom-level').html(e)
  },
  zoomIn: function () {
    this.dispatcher.trigger('paper:zoom', false)
  },
  zoomOut: function () {
    this.dispatcher.trigger('paper:zoom', true)
  },
  zoomFit: function () {
    this.dispatcher.trigger('paper:fit')
  },
})
