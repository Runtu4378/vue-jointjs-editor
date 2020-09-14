const template = `
<div class="fullcode enabled" data-tooltip="Full Playbook">
  <i class="fa fa-code"></i>
</div>
<div class="global enabled" data-tooltip="Global Block">
  <i class="fa fa-globe"></i>
</div>
<div class="block" data-tooltip="">
  <i class="fa fa-code"></i>
  <ul class="code-blocks">
    <li class="main active" data-section="block">Block Function</li>
    <li class="callback enabled" data-section="callback">Callback Function</li>
    <li class="join enabled" data-section="join">Join Function</li>
  </ul>
</div>
<div class="revert" data-tooltip="Revert Changes">
  <i class="fa fa-undo"></i>
</div>
`

export default Backbone.View.extend({
  className: 'extras',
  events: {
    'click .fullcode.enabled': 'fullCode',
    'click .revert.enabled': 'revertCode',
    'click .global.enabled': 'globalCode',
    'click li.enabled': 'blockCode',
    'mouseenter .block.enabled': 'showCodeNav',
    'mouseleave .block.enabled': 'hideCodeNav',
    'mouseenter div': 'showTip',
    'mouseleave div': 'hideTip',
  },
  initialize: function () {
    this.template = _.template(template)
  },
  render: function () {
    this.$el.html(this.template())
    return this
  },
})
