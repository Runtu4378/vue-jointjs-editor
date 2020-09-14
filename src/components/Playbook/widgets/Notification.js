import config from '../config'

const template = `
<%= message %><span class="close"></span>
`

export default Backbone.View.extend({
  className: 'message',
  events: {
    'click .close': 'close',
  },
  initialize: function (config) {
    this.data = config || {
      message: 'Default notification message',
      autoHide: true,
      showClose: true,
    }
    this.timeout = this.data.timeout
      ? this.data.timeout
      : 5
    this.template = _.template(template)
    this.timer = null

    this.listenTo(this.dispatcher, 'notification:clear', this.close)
    this.render()
  },
  render: function () {
    $(`#${config.layouts.notificationsId}`).prepend(this.$el.html(this.template(this.data)))
    if (this.data.autoHide) {
      this.timer = setTimeout(_.bind(this.close, this), 1e3 * this.timeout)
    }
    this.data.type && this.$el.addClass(this.data.type)
    return this
  },
  close: function () {
    const that = this
    this.timeout = null
    this.$el.fadeOut(200, function () {
      that.remove()
    })
  },
})
