import config from '../config'

import Editor from './Editor'

export default Backbone.View.extend({
  initialize: function () {
    this.listenTo(this.dispatcher, 'frame:close', this.frameClose)
    this.listenTo(this.coa, 'change:frameState', this.frameState)

    this.listenTo(this.dispatcher, 'editor:toggle', this.toggleEditor)
    this.listenTo(this.dispatcher, 'editor:expand', this.expandEditor)
    this.listenTo(this.dispatcher, 'editor:compress', this.compress)
    this.listenTo(this.dispatcher, 'editor:open', this.openEditor)
    this.listenTo(this.dispatcher, 'editor:close', this.closeEditor)
    this.listenTo(this.coa, 'change:editorOpen', this.editorState)

    this.render()
  },
  render: function () {
    this.editor = new Editor()

    this.$frames = $(`#${config.layouts.framesId}`)

    return this
  },

  frameClose: function () {
    this.closeEditor()
  },
  compress: function () {
    this.coa.frameState('open')
  },

  frameState: function (t, state) {
    if (state === 'open') {
      this.$frames.removeClass('full').addClass('open')
    } else if (state === 'full') {
      this.$frames.removeClass('open').addClass('full')
    } else {
      this.$frames.removeClass('full').removeClass('open')
    }
  },
  editorState: function (t, state) {
    state ? this.editor.setOpen() : this.editor.setClosed()
  },

  openEditor: function () {
    this.coa.frameState() === 'closed' && this.coa.frameState('open')
    this.coa.setEditor(true)
  },
  closeEditor: function () {
    this.coa.frameState('closed')
    this.coa.setEditor(false)
    this.editor.$el.removeAttr('style')
  },
  toggleEditor: function () {
    if (this.coa.isEditorOpen()) {
      this.coa.setEditor(false)
      this.coa.frameState('closed')
    } else {
      this.coa.frameState() === 'closed' && this.coa.frameState('open')
      this.coa.setEditor(true)
      this.dispatcher.trigger('editor:refresh')
    }
  },
  expandEditor: function () {
    this.coa.frameState('full')
    this.coa.setEditor(true)
    this.dispatcher.trigger('editor:refresh')
  },
})
