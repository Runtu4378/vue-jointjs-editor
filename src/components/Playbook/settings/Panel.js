import Input from '../widgets/Input'

const template = `
<div class="playbook-meta">
  <h3>Playbook Settings</h3>
  <div class="version-numbers">
    <div>Playbook ID: <% if (playbook_id) { %><%= playbook_id %><% } else { %>n/a<% } %></div>
  </div>
  <div class="inputs"></div>
  <div class="clear"></div>
  <div class="description">
    <label for="description">Description</label>
    <textarea id="description" name="description" maxlength="1200"></textarea>
  </div>
  <ul class="links">
    <% if (playbook_id) { %>
      <li><i class="fa fa-fw fa-upload"></i><a href="#" class="export">Export Playbook</a></li>
    <li><i class="fa fa-fw fa-list"></i><a href="#" class="history">Revision History</a></li>
    <li><i class="fa fa-fw fa-search"></i><a href="#" class="audit">Audit Trail</a></li>
    <% } %>
  </ul>
</div>
`

export default Backbone.View.extend({
  className: 'settings-panel',
  events: {
    'click a.audit': 'downloadAudit',
    'click a.export': 'exportPlaybook',
    'click a.history': 'showHistory',
    'blur #description': 'updateDescription',
  },
  initialize: function () {
    this.template = _.template(template)
    this.open = false
    this.inputs = []
    this.toggles = []

    this.listenTo(this.coa, 'change:editMode', this.editMode)
    this.listenTo(this.playbook, 'change:draft_mode', this.setActiveState)
    this.listenTo(this.dispatcher, 'playbook:settings', this.togglePanel)

    this.render()
  },
  render: function () {
    this.$el.html(this.template({
      playbook_id: this.playbook.id,
    }))
    this.nameInput = new Input({
      model: this.playbook,
      field: 'name',
      placeholder: 'Playbook name',
      label: 'name',
    })
    this.$el.find('.inputs').append(this.nameInput.render().el)

    return this
  },

  togglePanel: function (state) {
    this.open && !state
      ? this.collapse()
      : this.expand()
  },
  expand: function () {
    this.open = true
    this.$el.addClass('open')
    this.setTabIndexes()
  },
  collapse: function () {
    var that = this
    if (this.open) {
      this.clearTabIndexes()
      that.open = false
      this.$el.removeClass('open')
    }
  },

  setTabIndexes: function () {
    this.$el
      .find('input[type="text"], label.toggle-label, textarea, a')
      .each(function (t, e) {
        $(e).attr('tabIndex', t + 1)
      })
  },
  clearTabIndexes: function () {
    this.$el
      .find('input[type="text"], label.toggle-label, textarea, a')
      .attr('tabIndex', '-1')
  },

  updateDescription: function () {
    if (this.coa.get('editMode')) {
      let txt = this.$el.find('#description').val()
      txt = _.trim(txt)

      this.playbook.set('description', txt)
    }
  },
})
