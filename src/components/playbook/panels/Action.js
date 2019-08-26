/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'

export default _bb.View.extend({
  initialize: function () {
    this.panel = null
    this.state = this.coa.get('actionSelectState')
    this.state || (this.state = this.model.get('state'))
    this.state === 'asset'
      ? this.state = 'action_assets'
      : this.state === 'action' && (this.state = 'actions')
    this.coa.set('actionSelectState', this.state)
  },
  remove: function () {
    this.cleanup()
    _bb.View.prototype.remove.apply(this)
  },
  cleanup: function () {
    this.panel && this.panel.remove()
  },
  render: function () {
    this.cleanup()
    switch (this.state) {
      case 'apps':
        this.panel = new n({
          model: this.model,
        })
        break
      case 'app_actions':
        this.panel = new s({
          model: this.model,
        })
        break
      case 'app_action_config':
        this.panel = new o({
          model: this.model,
        })
        break
      case 'app_action_assets':
        this.panel = new a({
          model: this.model,
        })
        break
      case 'actions':
        this.panel = new r({
          model: this.model,
        })
        break
      case 'action_assets':
        this.panel = new l({
          model: this.model,
        })
        break
      case 'action_apps':
        this.panel = new c({
          model: this.model,
        })
        break
      case 'action_app_config':
        this.panel = new h({
          model: this.model,
        })
        break
      default:
        console.warn('WARNING: Invalid panel state:', this.state)
    }
    this.panel && this.panel.render()
    return this.panel
  },
})
