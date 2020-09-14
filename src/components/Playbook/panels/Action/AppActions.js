import PanelBase from '../Base'
import PanelNav from './components/PanelNav'
import AppLogo from './components/AppLogo'
import ActionList from './components/ActionList'

export default PanelBase.extend({
  className: 'panel-wrapper',
  initialize: function () {
    PanelBase.prototype.initialize.apply(this, arguments)
    this.panelNav = new PanelNav({
      model: this.model,
    })
    this.appLogo = new AppLogo({
      model: this.model,
    })
    this.actionList = new ActionList({
      model: this.model,
    })
  },
  render: function () {
    this.$el.append(
      this.panelNav.render().el,
      this.appLogo.render().el,
      this.actionList.render().el,
    )
    this.panelNav.setBackBtnDisabled(false)
    return this
  },
  remove: function () {
    this.panelNav.remove()
    this.appLogo.remove()
    this.actionList.remove()
    PanelBase.prototype.remove.apply(this)
  },
})
