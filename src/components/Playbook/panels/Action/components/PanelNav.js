const tempalte = `
<button class="back"><i class="fa fa-angle-left"></i></button>
<div class="link action"><%= part_one %></div>
<% if (part_two) { %><div class="link"><i class="fa fa-angle-right"></i><%- part_two %></div><% } %>
`

export default Backbone.View.extend({
  className: 'panel-nav',
  initialize: function () {
    this.template = _.template(tempalte)
    this.backBtn = null
    this.backBtnDisabled = false
  },
  render: function () {
    const actionSelectState = this.coa.get('actionSelectState')
    let part_one = ''
    let part_two = ''
    switch (actionSelectState) {
      case 'app_actions':
        part_one = this.model.get('app')
        break
      case 'app_action_config':
      case 'app_action_assets':
        part_one = this.model.get('app')
        part_two = this.model.get('action')
        break
      case 'action_assets':
      case 'action_apps':
        part_one = this.model.get('action')
        break
      case 'action_app_config':
        part_one = this.model.get('action')
        part_two = this.model.get('app')
    }
    this.$el.html(this.template({
      part_one: part_one,
      part_two: part_two,
    }))
    this.backBtn = this.$el.find('.back')

    // 手动挂载事件
    this.delegateEvents({
      'click .back': 'back',
      'click .action': 'actionSelect',
      'click .asset': 'assetSelect',
      'click .app': 'appSelect',
    })
    return this
  },
  setBackBtnDisabled: function (status) {
    this.backBtn.prop('disabled', status)
  },
  back: function () {
    const nowState = this.coa.get('actionSelectState')
    let prevState = nowState
    switch (nowState) {
      case 'app_actions':
        prevState = 'apps'
        break
      case 'app_action_config':
        prevState = 'app_actions'
        break
    }
    if (prevState !== nowState) {
      this.coa.set('actionSelectState', prevState)
      this.dispatcher.trigger('panel:update')
    }
  },
  actionSelect: function () {},
  assetSelect: function () {},
  appSelect: function () {},
})
