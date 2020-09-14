import DropdownContainer from '../widgets/Dropdown/container'

const template = `
<div class="modal-overlay"></div>
<div class="comment">
  <h2><%= title %></h2>
  <% if (saveAs) { %>
      <% if (notice.length > 0) { %>
        <p><%= notice %></p>
      <% } %>
  <div class=" playbook-name-wrapper">
    <label for="playbook_title">Playbook Name</label>
    <input name="playbook_title" placeholder='<%= pbName %>_copy' value='<%= pbName %>_copy'></input>
  </div>
  <% } %>
  <div class="source-control"></div>
  <div class="clear"></div>
  <% if (showComment) { %>
    <div class="comment-wrapper">
    <label for="comment">Please enter a comment (<%= placeholder %>)</label>
    <textarea name="comment"><%= comment %></textarea>
  </div>
    <% if (!saveAs) { %>
        <div class="require-comment"><i class="fa fa-square-o"></i><span>Reuse this comment until editor is reloaded (Ctrl+S or Shift+Save button to show this dialog again)</span></div>
      <div class="clear"></div>
    <% } %>
  <% } %>
  <div class="controls">
    <div class="cancel btn btn-secondary"><span>Cancel</span></div>
    <div class="confirm btn btn-primary">Save</div>
  </div>
  <div class="close"></div>
</div>
`

export default Backbone.View.extend({
  className: 'modal',
  events: {
    'click .confirm': 'validate',
    'click .cancel': 'cancel',
    'focus textarea': 'select',
    'click i.fa': 'toggleRequireComment',
    'click .close': 'cancel',
  },
  initialize: function (props) {
    this.callback = props && props.callback
      ? props.callback
      : this.cancel
    this.saveAs = props && props.hasOwnProperty('saveAs')
      ? props.saveAs
      : false

    this.template = _.template(template)

    this.listenTo(this.dispatcher, 'scm:update', this.setSCM)
    this.listenTo(this.dispatcher, 'key:escape', this.cancel)

    this.render()
  },
  render: function () {
    this.coa.set('commentOpen', true)

    var t = this.coa.get('codeChanged') || this.coa.get('propsChanged') || this.saveAs ? !0 : !1
    var e = this.coa.get('codeChanged') && !this.saveAs ? 'Required' : 'Optional'
    var n = this.saveAs ? 'Save Playbook As' : 'Save Playbook'
    var s = this.saveAs && this.playbook.get('active') ? 'Notice: The copy being saved is marked active and will run automatically.' : ''

    $('body').append(this.$el.html(this.template({
      comment: this.playbook.get('comment'),
      showComment: t,
      placeholder: e,
      title: n,
      notice: s,
      saveAs: this.saveAs,
      pbName: this.playbook.get('name'),
    })))

    this.scms = this.playbook.get('available_scm')

    var o = this.playbook.get('scm')
    var a = _.find(this.scms, 'id', o)
    var r = _.pluck(this.scms, 'name')
    var l = a ? a.name : ''

    if (
      this.scms.length > 1 ||
      l === '' ||
      this.saveAs
    ) {
      this.dropdown = new DropdownContainer({
        label: 'Source control to save to',
        placeholder: 'Select repository',
        name: 'scm',
        value: l,
        data: r,
        freeform: !1,
        action: 'scm:update',
      })
      this.$el.find('.source-control').append(this.dropdown.render().el)
    }

    return this
  },
})
