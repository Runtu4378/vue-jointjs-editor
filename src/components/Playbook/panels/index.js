import config from '../config'

import Drawer from './Drawer'
import Selector from './Selector'

import ActionPanel from './Action/index'
import FilterPanel from './Filter/index'
import DecisionPanel from './Decision/index'

export default Backbone.View.extend({
  el: `#${config.layouts.panelId}`,
  initialize: function () {
    this.initEvent()
    this.panel = null
    this.drawer = new Drawer({
      el: this.el,
    })
  },
  render: function () {
    return this
  },

  /// ----以下是自定义方法----
  initEvent: function () {
    this.listenTo(this.dispatcher, 'panel:selector', this.showSelectorPanel)
    this.listenTo(this.dispatcher, 'panel:update', this.update)
    this.listenTo(this.dispatcher, 'panel:close', this.closeSelectorPanel)
    this.listenTo(this.blocks, 'change:active', this.setState)
  },

  openPanel: function () {
    if (this.coa.get('editMode')) {
      this.coa.set('panelOpen', true)
      this.drawer.animatePosition(0, () => {
        document.getSelection().removeAllRanges()
        if (this.coa.get('openSettings')) {
          this.dispatcher.trigger('settings:open', this.coa.get('openSettings'))
          this.coa.set('openSettings', '')
        }
      })
    }
  },
  closePanel: function () {
    if (this.coa.get('panelOpen')) {
      this.coa.set('panelOpen', false)
      this.drawer.animatePosition(-this.drawer.$el.width(), () => {
        document.getSelection().removeAllRanges()
        if (this.panel) {
          this.panel.remove()
          this.panel = null
        }
      })
    }
  },

  /** 显示节点选择弹窗 */
  showSelectorPanel: function () {
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
    const that = this
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
          that.showPanel(t)
          that.timer = null
        }, 500)
      } else {
        this.showPanel(t)
      }
    }
  },
  setState: function (block, active) {
    $(document.activeElement).blur()
    if (active) {
      this.dispatcher.trigger('editor:init')
      this.update()
    } else {
      this.closePanel()
    }
  },

  showPanel: function (t) {
    const block = this.blocks.getActive()
    if (block) {
      if (block.changed.has_custom_block) {
        t = true
      }
      if (this.panel) {
        this.panel.remove()
        this.panel = null
      }
      switch (block.get('type')) {
        case 'coa.StartEnd':
          this.closePanel()
          this.panel = null
          break
        case 'coa.Action':
          this.panel = new ActionPanel({
            model: block,
          })
          break
        case 'coa.Filter':
          this.panel = new FilterPanel({
            model: block,
          })
          break
        case 'coa.Decision':
          this.panel = new DecisionPanel({
            model: block,
          })
          break
        default:
          console.log('Invalid block type:', block.get('type'))
      }
      if (this.panel) {
        this.drawer.$el.html(this.panel.render().el)
        this.coa.get('panelOpen') || this.openPanel()
      }
      t || this.dispatcher.trigger('code:update')
      return this.panel
    }
  },
})
