/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'
import $ from 'jquery'

import Drawer from './drawer'
import Selector from './selector'

export default _bb.View.extend({
  initialize: function ({
    id,
  }) {
    this.listenTo(this.dispatcher, 'panel:selector', this.showSelectorPanel)
    this.listenTo(this.dispatcher, 'panel:update', this.update)
    this.listenTo(this.blocks, 'change:active', this.setState)
    this.listenTo(this.dispatcher, 'panel:close', this.closeSelectorPanel)
    this.panel = null
    this.drawer = new Drawer({
      el: `#${id}`,
    })
  },
  render: function () {
    return this
  },

  openPanel: function () {
    var t = this
    if (this.coa.get('editMode') || !this.coa.get('active')) {
      this.coa.set('panelOpen', !0)
      this.drawer.animatePosition(0, function () {
        document.getSelection().removeAllRanges()
        if (t.coa.get('openSettings')) {
          t.dispatcher.trigger('settings:open', t.coa.get('openSettings'))
          t.coa.set('openSettings', '')
        }
      })
    }
  },

  showSelectorPanel: function () {
    // console.log('open')
    if (this.panel) {
      this.panel.remove()
      this.panel = null
    }
    this.panel = new Selector()
    this.drawer.$el.html(this.panel.render().el)
    if (!this.coa.get('panelOpen')) {
      this.openPanel()
    }
    return this.panel
  },
})
