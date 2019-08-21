/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'
import _ from 'underscore'

const template = `<div class="caption">This block has custom code, some UI controls have been disabled. Revert to restore all functionality.</div>
<div class="revert btn btn-primary">Revert Code</div>
`

export default _bb.View.extend({
  className: 'revert-view',
  events: {
    'click .revert': 'revertCode',
  },
  initialize: function () {
    this.template = _.template(template)
  },
  render: function () {
    this.$el.html(this.template())
    return this
  },
  revertCode: function () {
    this.dispatcher.trigger('code:revert')
  },
})
