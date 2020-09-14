import config from '../config'
import Base from './Base'

const template = `
<h3>选择要添加哪种节点</h3>
<div class="box">
  <h5 class="">Execute Actions</h5>
  <div class="row">
    <span class="block" data-block="action">
      <img src="${config.staticPrefix}/selector_action_light_test.svg">
      <p>Action</p>
    </span>
    <div class="clear"></div>
  </div>
</div>
<div class="box">
  <h5>Process Filters</h5>
  <div class="row">
    <span class="block" data-block="filter">
      <img src="${config.staticPrefix}/selector_filter_light.png">
      <p>Filter</p>
    </span>
    <span class="block" data-block="decision">
      <img src="${config.staticPrefix}/selector_playbook_light1.svg">
      <p>Decisions</p>
    </span>
    <div class="clear"></div>
  </div>
</div>
<div class="box hidden">
  <h5>Human Input</h5>
  <div class="row">
    <span class="block" data-block="manual">
      <img src="${config.staticPrefix}/selector_manual_light.svg">
      <p>manual</p>
    </span>
    <span class="block hidden" data-block="decision">
      <img src="${config.staticPrefix}/selector_playbook_light1.svg">
      <p>Decision</p>
    </span>
    <div class="clear"></div>
  </div>
</div>
<div class="box hidden">
  <h5>Process Filters</h5>
  <div class="row">
    <span class="block" data-block="manual">
      <img src="${config.staticPrefix}/selector_manual_light.svg">
      <p>manual</p>
    </span>
    <div class="clear"></div>
  </div>
</div>
`

export default Base.extend({
  className: 'block-selector',
  events: {
    'click .block': 'addBlock',
  },
  initialize: function () {
    Base.prototype.initialize.apply(this, arguments)
    this.template = _.template(template)
  },
  remove: function () {
    Base.prototype.remove.apply(this)
  },
  render: function () {
    this.$el.html(this.template())
    return this
  },

  /// ----以下是自定义方法----
  addBlock: function (eve) {
    var target = $(eve.currentTarget)
    var blockName = target.data('block')
    this.dispatcher.trigger('block:add', blockName)
  },
})
