import PanelBase from '../Base'
import PanelNav from './components/PanelNav'
import ActionInfo from './components/ActionInfo'

import ActionConfigField from './components/ActionConfigField'
import ActionConfigTemplateField from './components/ActionConfigTemplateField'

export default PanelBase.extend({
  className: 'panel-wrapper app-action-config',
  initialize: function () {
    PanelBase.prototype.initialize.apply(this, arguments)

    this.appid = this.model.get('appid')
    this.actionName = this.model.get('action')

    this.app = this.apps.findWhere({ id: this.appid })
    this.action = this.actions.findWhere({
      appid: `${this.appid}`,
      name: this.actionName,
    })

    this.panelNav = new PanelNav({
      model: this.model,
    })
    this.actionInfo = new ActionInfo({
      model: this.model,
      action: this.action,
    })
    if (this.actionName !== 'message_template') {
      this.actionConfigField = new ActionConfigField({
        model: this.model,
        action: this.action,
      })
    } else {
      this.actionConfigField = new ActionConfigTemplateField({
        model: this.model,
        action: this.action,
      })
    }

    this.listenTo(this.app, 'change:actions', this.onSync)

    this.render()
  },
  render: function () {
    this.$el.empty()
    this.$el.append(
      this.panelNav.render().el,
      this.actionInfo.render().el,
      this.actionConfigField.render().el,
    )
    this.panelNav.setBackBtnDisabled(false)

    return this
  },
  remove: function () {
    this.panelNav.remove()
    this.actionInfo.remove()
    this.actionConfigField.remove()
    PanelBase.prototype.remove.apply(this)
  },
})
