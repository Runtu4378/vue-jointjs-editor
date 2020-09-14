import config from '../config'

import Header from './editor/Header'
import Extras from './editor/Extras'
import Codemirror from './editor/Codemirror'

const id = `#${config.layouts.editorId}`
const template = `
<div class="editor-tab">
  <span>Python Playbook Editor</span>
  <i class="fa fa-expand"></i>
</div>
<div class="editor-content"><textarea id="code" class="code"></textarea></div>
<div class="slider ui-resizable-handle"></div>
`

export default Backbone.View.extend({
  el: id,
  events: {
    'click .editor-tab span': 'toggle',
    'click .editor-tab i': 'expand',
    'click .compress': 'compress',
    'click .close': 'close',
  },
  initialize: function () {
    this.template = _.template(template)

    this.listenTo(this.coa, 'change:frameState', this.frameState)

    this.render()
  },
  render: function () {
    this.$el.html(this.template())

    this.header = new Header()
    this.extras = new Extras()
    this.editor = new Codemirror()

    this.$handle = this.$el.find('.slider')
    this.$el.find('.editor-content')
      .prepend(this.header.render().el)
      .append(this.extras.render().el)

    this.editor.render()

    // TODO 看下利用resizable实现了什么
    if (!this.$el.resizable('instance')) {
      this.$el.resizable({
        handles: 'e',
        classes: {
          'ui-resizable-handle': 'slider',
        },
        minWidth: 300,
        minHeight: null,
      })
    }

    return this
  },

  setOpen: function () {
    this.$el.addClass('open')
  },
  setClosed: function () {
    this.$el.removeClass('open')
  },

  toggle: function () {
    this.dispatcher.trigger('editor:toggle')
  },
  expand: function () {
    this.dispatcher.trigger('editor:expand')
  },
  compress: function () {
    this.dispatcher.trigger('editor:compress')
  },
  close: function () {
    this.dispatcher.trigger('editor:close')
  },
  frameState: function (t, state) {
    if (state !== 'closed') {
      this.$el.resizable('enable')
    } else {
      this.$el.resizable('disable')
    }
  },
})
