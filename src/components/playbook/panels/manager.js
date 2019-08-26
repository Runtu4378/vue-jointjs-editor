/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'
import $ from 'jquery'

import Drawer from './drawer'
import Selector from './selector'
import ActionPanel from './Action'

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
  closeSelectorPanel: function () {
    if (
      this.panel &&
      this.panel.el.className === 'block-selector'
    ) {
      this.closePanel()
    }
  },
  update: function (t) {
    var e = this
    if (['block', 'join', 'callback'].indexOf(this.coa.get('codeView')) === -1) {
      this.coa.set('codeView', 'block')
    }
    if (
      this.coa.get('reloading') ||
      this.timer ||
      !this.coa.get('editMode') ||
      this.coa.get('resolveOpen')
    ) {
      this.dispatcher.trigger('code:update')
    } else {
      if (
        this.drawer.$el.children().length > 1 ||
        this.drawer.$el.hasClass('wide')
      ) {
        this.timer = setTimeout(function () {
          e.showPanel(t)
          e.timer = null
        }, 500)
      } else {
        this.showPanel(t)
      }
    }
  },
  setState: function (t, e) {
    $(document.activeElement).blur()
    if (e) {
      this.dispatcher.trigger('editor:init')
      this.update()
    } else {
      this.closePanel()
    }
  },

  showPanel: function (t) {
    var e = this.blocks.getActive()
    if (e) {
      if (e.changed.has_custom_block) {
        t = true
      }
      if (this.panel) {
        this.panel.remove()
        this.panel = null
      }
      switch (e.get('type')) {
        case 'coa.Action':
          this.panel = new ActionPanel({
            model: e,
          })
          break
        case 'coa.Filter':
          this.panel = new s({
            model: e,
          })
          break
        case 'coa.Prompt':
          this.panel = new a({
            model: e,
          })
          break
        case 'coa.Playbook':
          this.panel = new PlaybookPanel({
            model: e,
          })
          break
        case 'coa.Decision':
          this.panel = new o({
            model: e,
          })
          break
        case 'coa.Format':
          this.panel = new c({
            model: e,
          })
          break
        case 'coa.Task':
          this.panel = new h({
            model: e,
          })
          break
        case 'coa.CallPlaybook':
          this.panel = new r({
            model: e,
          })
          break
        case 'coa.API':
          this.panel = new l({
            model: e,
          })
          break
        case 'coa.FunctionBlock':
          this.panel = new d({
            model: e,
          })
          break
        case 'coa.StartEnd':
          this.closePanel()
          this.panel = null
          break
        default:
          console.log('Invalid block type:', e.get('type'))
      }
      if (this.panel) {
        this.drawer.$el.html(this.panel.render().el)
        this.coa.get('panelOpen') || this.openPanel()
      }
      t || this.dispatcher.trigger('code:update')
      return this.panel
    }
  },
  closePanel: function () {
    var t = this
    if (this.coa.get('panelOpen')) {
      this.coa.set('panelOpen', false)
      this.drawer.animatePosition(-this.drawer.$el.width(), function () {
        document.getSelection().removeAllRanges()
        if (t.panel) {
          t.panel.remove()
          t.panel = null
        }
      })
    }
  },
})
