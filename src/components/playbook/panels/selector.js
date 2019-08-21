/* eslint comma-dangle: ["error", "always-multiline"] */

import $ from 'jquery'
import _ from 'underscore'

import Base from './base'

const template = `<h3>What type of block would you like to add?</h3>
<div class="box">
  <h5>Execute Actions</h5>
  <div class="row">
    <span class="block" data-block="action">
      <img src="/inc/coa/img/selector_action_<%= theme %>.svg">
      <p>Action</p>
    </span>
    <span class="block" data-block="playbook">
      <img src="/inc/coa/img/selector_playbook_<%= theme %>.svg">
      <p>Playbook</p>
    </span>
    <span class="block" data-block="api">
      <img src="/inc/coa/img/selector_api_<%= theme %>.svg">
      <p>API</p>
    </span>
    <div class="clear"></div>
  </div>
</div>
<div class="box">
  <h5>Process Filters</h5>
  <div class="row">
    <span class="block" data-block="filter">
      <img src="/inc/coa/img/selector_filter_<%= theme %>.svg">
      <p>Filter</p>
    </span>
    <span class="block" data-block="decision">
      <img src="/inc/coa/img/selector_decision_<%= theme %>.svg">
      <p>Decisions</p>
    </span>
    <span class="block" data-block="format">
      <img src="/inc/coa/img/selector_format_<%= theme %>.svg">
      <p>Format</p>
    </span>
    <div class="clear"></div>
  </div>
</div>
<div class="box">
  <h5>Human Input</h5>
  <div class="row">
    <span class="block" data-block="prompt">
      <img src="/inc/coa/img/selector_prompt_<%= theme %>.svg">
      <p>Prompt</p>
    </span>
    <span class="block" data-block="task">
      <img src="/inc/coa/img/selector_task_<%= theme %>.svg">
      <p>Manual Task</p>
    </span>
    <div class="clear"></div>
  </div>
</div>
<% if (canEditCode) { %>
  <div class="box">
  <h5>Custom Code</h5>
  <div class="row">
    <span class="block" data-block="functionBlock">
      <img src="/inc/coa/img/selector_custom_function_<%= theme %>.svg">
      <p>Custom Function</p>
    </span>
    <div class="clear"></div>
  </div>
</div>
<% } %>
`

export default Base.extend({
  className: 'block-selector',
  events: {
    'click .block': 'addBlock',
  },
  initialize: function () {
    Base.prototype.initialize.apply(this, arguments)
    this.canEditCode = window.Object.edit_code
    this.template = _.template(template)
  },
  remove: function () {
    Base.prototype.remove.apply(this)
  },
  render: function () {
    var t = window.PHANTOM_THEME === 'dark' ? 'dark' : 'light'
    this.$el.html(this.template({
      theme: t,
      canEditCode: this.canEditCode,
    }))
    return this
  },
  addBlock: function (t) {
    var e = $(t.currentTarget)
    var i = e.data('block')
    this.dispatcher.trigger('block:add', i)
  },
})
