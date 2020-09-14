export default {
  initEditMode: function () {
    this.listenTo(this.coa, 'change:editMode', this.editModeChange)
  },
  setEditMode: function () {
    this.editModeChange(this.coa, this.coa.get('editMode'))
  },
  editModeChange: function (t, e) {
    e ? this.enable() : this.disable()
  },
  enable: function () {
    this.$el.removeClass('disabled')
    this.$el.find('input').removeAttr('readonly')
  },
  disable: function () {
    this.$el.addClass('disabled')
    this.$el.find('input').attr('readonly', 'readonly')
  },
  enableBodyClick: function () {
    this.listenTo(this.dispatcher, 'body:click', this.onBodyClick)
  },
}
