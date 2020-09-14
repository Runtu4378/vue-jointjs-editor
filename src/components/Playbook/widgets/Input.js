const template = `
<label><%= label %></label>
<input type="text" autocomplete="off" value="<%= value %>" placeholder="<%= placeholder %>"/>
`

export default Backbone.View.extend({
  className: 'input-widget',
  events: {
    'focusout input': 'save',
    'focusin input': 'clearError',
  },
  initialize: function (config = {}) {
    const {
      label = '',
      field,
      placeholder = '请输入',
    } = config

    this.label = label
    this.field = field
    this.placeholder = placeholder
    this.enabled = !0
    this.template = _.template(template)
    this.listenTo(this.coa, 'change:editMode', this.editModeChange)
  },
  render: function () {
    this.$el.html(this.template({
      value: '',
      label: this.label,
      placeholder: this.placeholder,
    }))
    this.$el.attr('id', this.field + '-widget')
    this.$el.attr('cid', this.cid)
    this.$el.find('input').val(this.model.get(this.field))
    this.coa.get('editMode') || this.disable()
    return this
  },

  editModeChange: function (t, state) {
    state ? this.enable() : this.disable()
  },
  enable: function () {
    this.enabled = true
    this.$el.removeClass('disabled')
    this.$el.find('input').removeAttr('readonly')
  },
  disable: function () {
    this.enabled = false
    this.$el.addClass('disabled')
    this.$el.find('input').attr('readonly', 'readonly')
  },

  save: function () {
    this.disableBodyClick()
    this.model.set(this.field, this.$el.find('input').val())
    this.$el.removeClass('edit')
  },
  clearError: function () {
    this.$el.removeClass('error')
  },
  enableBodyClick: function () {
    this.listenTo(this.dispatcher, 'body:click', this.onBodyClick)
  },
  disableBodyClick: function () {
    this.stopListening(this.dispatcher, 'body:click', this.onBodyClick)
  },
  onBodyClick: function (t) {
    var e = $(t.target).closest('.input-widget')
    if (e.length === 0 || e.first().attr('cid') !== this.cid) {
      this.save()
    }
    (e.length === 0 || e.first().attr('cid') !== this.cid) && this.save()
  },
})
