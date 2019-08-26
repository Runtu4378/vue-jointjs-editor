import PanelBase from '../base'

import ByTypeNav from './components/by_type_nav'
import AppList from './components/app_list'

export default PanelBase.extend({
  className: 'panel-wrapper action',
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
    if (this.model.get('has_custom_block')) {
      this.$el.append(this.typeNav.render().el)
      this.addRevert(this.$el)
    } else {
      this.$el.append(this.typeNav.render().el, this.appList.render().el)
    }
    return this
  }
})
