/* eslint comma-dangle: ["error", "always-multiline"] */
/* globals $ */

import _bb from 'backbone'
import _ from 'underscore'
// import $ from 'jquery'

import { defaultProps } from '../../nodes/base'
import Input from '../../widgets/input'
import Button from '../../widgets/button'

const template = `<div class="top">
  <div class="logo"><a target="_blank" href="/"><img src="${defaultProps.imgPrefix}/splunk-phantom-logo.svg"/></a></div>
  <div class="inputs"></div>
  <div class="action"></div>
  <div class="repo">
    <div class="repo-name">Repo: <%= scm %></div>
  </div>
  <div class="missing-assets">
    <i class="fa fa-warning"></i><span class="asset-count"></span>
  </div>
</div>
<div class="canvas-controls">
  <div class="zoom-fit"><i class="fa fa-expand"></i></div>
  <div class="zoom-minus"><i class="fa fa-minus"></i></div>
  <div class="zoom-plus"><i class="fa fa-plus"></i></div>
  <div class="zoom-level">100%</div>
</div>
`

export default _bb.View.extend({
  events: {
    'click .zoom-plus': 'zoomIn',
    'click .zoom-minus': 'zoomOut',
    'click .zoom-fit': 'zoomFit',
    'click .history': 'showHistory',
    'click .missing-assets': 'showMapper',
  },
  initialize: function (id) {
    this.el = `#${id}`
    this.$el = $(this.el)
    this.nameInput = null
    this.action = null
    this.buttonWidget = null
    this.panelOpen = false
    this.template = _.template(template)
    // this.panel = new i
    // this.listenTo(this.dispatcher, 'update:labels', this.setLabels)
    // this.listenTo(this.dispatcher, 'update:tenants', this.setTenants)
    // this.listenTo(this.dispatcher, 'update:category', this.setCategory)
    // this.listenTo(this.dispatcher, 'update:user', this.setUserId)
    // this.listenTo(this.dispatcher, 'update:tags', this.setTags)
    // this.listenTo(this.dispatcher, 'paper:scale', this.onScale)
    // this.listenTo(this.dispatcher, 'mode:view', this.setViewMode)
    this.listenTo(this.dispatcher, 'mode:edit', this.setEditMode)
    // this.listenTo(this.dispatcher, 'editor:full', this.setEditorFull)
    // this.listenTo(this.dispatcher, 'editor:small', this.setEditorSmall)
    // this.listenTo(this.dispatcher, 'header:close', this.collapse)
    // this.listenTo(this.dispatcher, 'playbook:settings', this.togglePanel)
    // this.listenTo(this.dispatcher, 'resolve:updateCount', this.missingAssetCount)
    // this.listenTo(this.coa, 'change:frameState', this.frameState)
    // this.listenTo(this.coa, 'change:notesOpen', this.notesOpen)
    this.render()
  },
  render: function () {
    this.$el.html(this.template({
      version: this.playbook.id,
      phantom_version: window.PHANTOM_VERSION,
      scm: this.playbook.get('scm_name'),
    }))
    this.nameInput = new Input({
      model: this.playbook,
      field: 'name',
      placeholder: 'Playbook name',
      label: '',
    })
    this.$el.find('.inputs').append(this.nameInput.render().el)
    this.buttonWidget = new Button({
      style: 'btn-primary',
    })
    this.cancelWidget = new Button({
      style: 'btn-secondary',
    })
    // this.settingsWidget = new Button({
    //   style: 'btn-secondary settings',
    // })
    this.cancelWidget.label = 'Cancel'
    this.cancelWidget.action = 'playbook:cancel'
    // this.settingsWidget.label = 'Playbook Settings'
    // this.settingsWidget.action = 'playbook:settings'
    this.$el.find('.action').append(
      this.buttonWidget.render().el,
      this.cancelWidget.render().el,
      // this.settingsWidget.render().el
    )
    this.cancelWidget.hide()
    // this.panel.render()
    this.controls = this.$el.find('.canvas-controls')
    this.coa.frameState() === 'full' && this.controls.hide()
    this.coa.get('editMode') ? this.setEditMode() : this.setViewMode()
    return this
  },
  setViewMode: function () {
    _.each(this.inputs, function (t) {
      t.disable()
    })
    this.cancelWidget.hide()
    this.buttonWidget.label = 'Edit playbook'
    this.buttonWidget.action = 'playbook:edit'
    this.buttonWidget.render()
    window.Object.edit_playbooks ? this.buttonWidget.enable() : this.buttonWidget.disable()
  },
  setEditMode: function () {
    _.each(this.inputs, function (t) {
      t.enable()
    })
    this.cancelWidget.show()
    this.buttonWidget.label = 'Save'
    this.buttonWidget.action = 'playbook:save'
    this.playbook.get('name') && (this.buttonWidget.options = [{
      name: 'Save',
      id: 'save-btn',
      action: 'playbook:save',
    }, {
      name: 'Save As',
      id: 'save-as-btn',
      action: 'playbook:saveAs',
    }])
    this.buttonWidget.render()
    window.Object.edit_playbooks || this.buttonWidget.disable()
  },
  setArchiveMode: function () {
    _.each(this.inputs, function (t) {
      t.disable()
    })
    this.buttonWidget.label = 'Latest version'
    this.buttonWidget.action = 'playbook:current'
    this.buttonWidget.render()
  },
  frameState: function (t, e) {
    e === 'full' ? this.toggleControls(!1) : this.coa.get('notesOpen') || this.toggleControls(!0)
  },
  notesOpen: function (t, e) {
    if (e) {
      this.toggleControls(!1)
    } else if (!this.coa.get('frameState') !== 'full') {
      this.toggleControls(!0)
    }
  },
  getName: function (t) {
    var e = this.$el.find('#save-as-name').val()
    t(e)
  },
  toggleControls: function (t) {
    t ? this.controls.show() : this.controls.hide()
  },
  setEditorFull: function () {
    this.$el.addClass('fullscreen')
  },
  setEditorSmall: function () {
    this.$el.removeClass('fullscreen')
  },
  setLabels: function (t) {
    this.playbook.set('labels', t)
  },
  setTenants: function (t) {
    this.playbook.set('tenants', t)
  },
  setCategory: function (t) {
    this.playbook.set('category', t)
  },
  setUserId: function (t) {
    var e = this.users.findWhere({
      username: t,
    })
    e && this.playbook.set('run_as', e.id)
  },
  setTags: function (t) {
    this.playbook.set('tags', t)
  },
  zoomIn: function () {
    this.dispatcher.trigger('paper:zoom', !1)
  },
  zoomOut: function () {
    this.dispatcher.trigger('paper:zoom', !0)
  },
  zoomFit: function () {
    this.dispatcher.trigger('paper:fit')
  },
  onScale: function (t) {
    var e = Math.floor(100 * t) + '%'
    this.$el.find('.zoom-level').html(e)
  },
  togglePanel: function (t) {
    this.panelOpen && !t ? this.collapse() : this.expand()
  },
  expand: function () {
    this.$el.addClass('open')
    this.panelOpen = !0
    this.panel.setTabIndexes()
    this.panel.animatePosition(0)
  },
  collapse: function () {
    var t = this
    if (this.panelOpen) {
      this.panel.clearTabIndexes()
      this.panel.animatePosition(400, function () {
        t.panelOpen = !1
        t.$el.removeClass('open')
      })
    }
  },
  missingAssetCount: function () {
    var t = this.coa.missing_assets.length
    if (t > 0) {
      var e = t + ' missing asset' + (t > 1 ? 's' : '')
      this.$el.find('.asset-count').html(e).parent().show()
    } else this.$el.find('.asset-count').empty().parent().hide()
  },
  showMapper: function () {
    this.dispatcher.trigger('resolve:open')
  },
})
