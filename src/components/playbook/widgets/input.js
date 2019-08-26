/* eslint comma-dangle: ["error", "always-multiline"] */
/* globals $ */

import _bb from 'backbone'
import _ from 'underscore'
// import $ from 'jquery'

const template = `<input type="text" autocomplete="off" value="<%= value %>" placeholder="<%= placeholder %>"/>
`

export default _bb.View.extend({
  className: 'input-widget',
  events: {
    'focusout input': 'save',
    'focusin input': 'clearError',
  },
  initialize: function (t) {
    this.label = typeof t.label === 'undefined' ? '' : t.label
    this.field = t.field
    this.placeholder = t.placeholder ? t.placeholder : 'Enter value'
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
  editModeChange: function (t, e) {
    e ? this.enable() : this.disable()
  },
  enable: function () {
    this.enabled = !0
    this.$el.removeClass('disabled')
    this.$el.find('input').removeAttr('readonly')
  },
  disable: function () {
    this.enabled = !1
    this.$el.addClass('disabled')
    this.$el.find('input').attr('readonly', 'readonly')
  },
  enableBodyClick: function () {
    this.listenTo(this.dispatcher, 'body:click', this.onBodyClick)
  },
  disableBodyClick: function () {
    this.stopListening(this.dispatcher, 'body:click', this.onBodyClick)
  },
  onBodyClick: function (t) {
    var e = $(t.target).closest('.input-widget');
    (e.length === 0 || e.first().attr('cid') !== this.cid) && this.save()
  },
  save: function () {
    this.disableBodyClick()
    this.model.set(this.field, this.$el.find('input').val())
    this.$el.removeClass('edit')
  },
  clearError: function () {
    this.$el.removeClass('error')
  },
})
