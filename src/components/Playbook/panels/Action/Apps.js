import PanelBase from '../Base'

import ByTypeNav from './components/ByTypeNav'
import AppList from './components/AppList'

export default PanelBase.extend({
  className: 'panel-wrapper apps',
  initialize: function () {
    PanelBase.prototype.initialize.apply(this, arguments)
    this.typeNav = new ByTypeNav()
    this.appList = new AppList()
  },
  remove: function () {
    this.typeNav.remove()
    this.appList.remove()
    PanelBase.prototype.remove.apply(this)
  },
  render: function () {
    this.$el.append(this.typeNav.render().el, this.appList.render().el)
    return this
  },
})
