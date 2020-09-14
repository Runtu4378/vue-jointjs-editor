const template = `
<div class="clear">
  <img src="<%= logoURL %>"/>
</div>
`

export default Backbone.View.extend({
  className: 'header-app-logo',
  initialize: function () {
    this.template = _.template(template)
    this.app = this.apps.get(this.model.get('appid'))
  },
  render: function () {
    var logoURL = ''
    if (this.app) {
      logoURL = this.app.get('logoURL')
    }
    this.$el.html(this.template({ logoURL }))
    return this
  },
})
