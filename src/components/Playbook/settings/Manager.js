import config from '../config'

import Lab from './Lab'
import Panel from './Panel'

const id = `#${config.layouts.settingsId}`

export default Backbone.View.extend({
  el: id,
  initialize: function () {
    this.lab = new Lab()
    this.panel = new Panel()

    this.render()
  },
  render: function () {
    this.$el.append(
      this.lab.render().el,
      this.panel.render().el,
    )
  },
})
