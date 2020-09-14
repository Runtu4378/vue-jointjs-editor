import Apps from './Apps'
import AppActions from './AppActions'
import AppActionConfig from './AppActionConfig'

export default Backbone.View.extend({
  initialize: function () {
    this.panel = null
    this.state = this.coa.get('actionSelectState') || this.model.get('state')
    this.coa.set('actionSelectState', this.state)
  },
  render: function () {
    this.cleanup()
    switch (this.state) {
      case 'apps':
        this.panel = new Apps({
          model: this.model,
        })
        break
      case 'app_actions':
        this.panel = new AppActions({
          model: this.model,
        })
        break
      case 'app_action_config':
        this.panel = new AppActionConfig({
          model: this.model,
        })
        break
      default:
        console.warn('WARNING: Invalid panel state:', this.state)
    }
    this.panel && this.panel.render()
    return this.panel
  },
  remove: function () {
    this.cleanup()
    Backbone.View.prototype.remove.apply(this)
  },
  cleanup: function () {
    this.panel && this.panel.remove()
  },
})
