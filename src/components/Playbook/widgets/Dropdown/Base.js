export default Backbone.View.extend({
  events: {
    'click': 'setFocus',
    'focus input': 'setFocus',
  },
  initialize: function () {
    this.show = true
    this.enabled = true
    this.isOpen = false
    this.hasFocus = false
    this.reverseDisable = false

    this.listenTo(this.dispatcher, 'key:press', this.handleKeypress)
    this.listenTo(this.coa, 'change:editMode', this.editModeChange)
  },

  editModeChange: function (coa, editMode) {
    this.reverseDisable && (editMode = !editMode)
    editMode ? this.enable() : this.disable()
  },
  enable: function () {
    this.enabled = true
    this.$el.removeClass('disabled')
  },
  disable: function () {
    this.enabled = false
    this.$el.addClass('disabled')
    this.$el.find('input').attr('readonly', 'readonly')
  },

  handleKeypress: function (event, keyCode) {
    if (this.hasFocus) {
      if (keyCode === 40) {
        event.preventDefault()
        this.open()
      } else if (keyCode === 38) {
        event.preventDefault()
        this.close()
      } else if (keyCode === 9) {
        this.clearFocus()
        this.close()
      }
    }
  },

  setFocus: function () {
    this.hasFocus = true
  },
  clearFocus: function () {
    this.hasFocus = false
  },

  checkDisabled: function (t) {
    return !this.enabled || this.enabled && !this.freeform ? false : void 0
  },

  enableBodyClick: function () {
    this.listenTo(this.dispatcher, 'body:click', this.onBodyClick)
  },
  disableBodyClick: function () {
    this.stopListening(this.dispatcher, 'body:click', this.onBodyClick)
  },
  onBodyClick: function (event) {
    if (event) {
      event.preventDefault()
      const e = $(event.target).closest('.dropdown-widget')

      if (
        event.type === 'keydown' ||
        e.length === 0 ||
        e.first().attr('cid') !== this.cid
      ) {
        this.clearFocus()
        this.close()
      }
    }
  },
})
