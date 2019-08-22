/* eslint comma-dangle: ["error", "always-multiline"] */

// import _bb from 'backbone'
import _ from 'underscore'

import Drawer from '../../panels/drawer'

const template = `<div class="playbook-meta">
  <h3>Playbook Settings</h3>
  <div class="version-numbers">
    <div>Playbook ID: <% if (playbook_id) { %><%= playbook_id %><% } else { %>n/a<% } %></div>
    <div>Playbook Version: <% if (version) { %><%= version %><% } else { %>n/a<% } %></div>
    <div>Platform Version: <%= phantom_version %></div>
  </div>
  <div class="inputs"></div>
  <div class="toggles"></div>
  <div class="clear"></div>
  <div class="description">
    <label for="description">Description</label>
    <textarea id="description" name="description" maxlength="1200"></textarea>
  </div>
  <div class="notes">
    <label for="notes">Notes</label>
    <textarea id="notes" name="notes" maxlength="4000"></textarea>
  </div>
  <ul class="links">
    <% if (playbook_id) { %>
      <li><i class="fa fa-fw fa-upload"></i><a href="#" class="export">Export Playbook</a></li>
    <li><i class="fa fa-fw fa-list"></i><a href="#" class="history">Revision History</a></li>
    <li><i class="fa fa-fw fa-search"></i><a href="#" class="audit">Audit Trail</a></li>
    <% } %>
    <li><i class="fa fa-fw fa-file-o"></i><a href="/docs/vpe/overview" target="phantom_docs" class="">Docs</a></li>
  </ul>
</div>
`

export default Drawer.extend({
  el: '#right-panel',
  events: {
    'click a.audit': 'downloadAudit',
    'click a.export': 'exportPlaybook',
    'click a.history': 'showHistory',
    'blur #description': 'updateDescription',
    'blur #notes': 'updateNotes',
  },
  initialize: function () {
    this.template = _.template(template)
    this.inputs = []
    this.toggles = []
    this.listenTo(this.coa, 'change:editMode', this.editMode)
    this.listenTo(this.playbook, 'change:draft_mode', this.setActiveState)
  },
  render: function () {
    var t = "" === this.playbook.get('current_id') ? !0 : !1
    var e = this.playbook.get('category')
    var i = this.playbook.get('tags')
    var n = this.playbook.get('all_categories')
    var r = this.users.automationUsers
    var l = this.users.automationUsers[0]
    var c = _.map(this.system_tags.models, function (t) {
      return t.get('name')
    })
    if (this.playbook.get('run_as')) {
      var h = this.users.get(this.playbook.get('run_as'))
      h && (l = h.get('username'))
    } else if (l) {
      var u = this.users.findWhere({
        username: l,
      })
      this.playbook.set({
        run_as: u.id,
      })
    }
    "" === e && (e = "Uncategorized", this.playbook.set("category", e)), this.$el.html(this.template({
      playbook_id: this.playbook.id,
      version: this.playbook.get("version"),
      phantom_version: PHANTOM_VERSION,
      current_version: t
    }));
    var d = new o({
        label: "Operates on",
        name: "labels",
        values: this.filterLabelValues(),
        data: this.playbook.get("all_labels"),
        action: "update:labels",
        placeholder: "Select labels",
        freeform: !1
      }),
      p = window.Object.multi_tenant_enabled ? new o({
        label: "Tenants",
        name: "tenants",
        data: _.pluck(this.playbook.get("all_tenants"), "name"),
        values: this.playbook.id ? this.playbook.get("tenants") : [],
        action: "update:tenants",
        placeholder: "Select tenants",
        freeform: !1
      }) : null,
      f = new s({
        label: "Category",
        name: "category",
        value: e,
        freeform: !0,
        data: n,
        action: "update:category",
        placeholder: "Select category"
      }),
      g = new s({
        label: "Run as",
        name: "effective_user_id",
        value: l,
        data: r,
        action: "update:user",
        freeform: !1
      }),
      m = new o({
        label: "Tags",
        name: "tags",
        values: this.playbook.id ? i : [],
        data: c,
        action: "update:tags",
        placeholder: "Select tags",
        freeform: !1,
        disableSelectAll: !0
      });
    return this.inputs.push(d, f, g, m), p && this.inputs.push(p), this.$el.find(".inputs").append(d.render().el, p ? p.render().el : "", f.render().el, g.render().el, m.render().el), this.loggingToggle = new a({
      label: "Logging",
      model: this.playbook,
      field: "log_level"
    }), this.activeToggle = new a({
      label: "Active",
      model: this.playbook,
      field: "active"
    }), this.modeToggle = new a({
      label: "Safe Mode",
      model: this.playbook,
      field: "safe_mode"
    }), this.draftToggle = new a({
      label: "Draft Mode",
      model: this.playbook,
      field: "draft_mode"
    }), this.toggles.push(this.loggingToggle, this.activeToggle, this.modeToggle, this.draftToggle), this.$el.find(".toggles").append(this.loggingToggle.render().el, this.activeToggle.render().el, this.modeToggle.render().el, this.draftToggle.render().el), this.$el.find("#description").val(this.playbook.get("description")), this.$el.find("#notes").val(this.playbook.get("notes")), this.editMode(this.coa, this.coa.get("editMode")), window.Object.multi_tenant_enabled && this.$el.addClass("mssp"), this.$el.find("input, textarea, a").attr("tabIndex", "-1"), this
  },
  setTabIndexes: function () {
    this.$el.find('input[type="text"], label.toggle-label, textarea, a').each(function (t, e) {
      $(e).attr("tabIndex", t + 1)
    })
  },
  clearTabIndexes: function () {
    this.$el.find('input[type="text"], label.toggle-label, textarea, a').attr("tabIndex", "-1")
  },
  exportPlaybook: function () {
    window.open("/rest/playbook/" + this.playbook.id + "/export/", "_blank")
  },
  updateDescription: function () {
    if (this.coa.get("editMode")) {
      var t = this.$el.find("#description").val();
      t = _.trim(t), this.playbook.set("description", t), this.dispatcher.trigger("code:full")
    }
  },
  updateNotes: function () {
    if (this.coa.get("editMode")) {
      var t = this.$el.find("#notes").val();
      t = _.trim(t), this.playbook.set("notes", t)
    }
  },
  showHistory: function (t) {
    t.preventDefault();
    new r
  },
  downloadAudit: function () {
    window.open("/rest/playbook/" + this.playbook.id + "/audit?format=csv&start=2000-01-01&end=2100-01-01", "_blank")
  },
  editMode: function (t, e) {
    e ? (this.$el.find("textarea").removeAttr("readonly").removeClass("disabled"), this.$el.find("input").removeAttr("readonly").removeClass("disabled"), _.each(this.toggles, function (t) {
      t.enable()
    }), this.playbook.get("draft_mode") && this.activeToggle.disable()) : (this.$el.find("textarea").attr("readonly", !0).addClass("disabled"), _.each(this.toggles, function (t) {
      t.disable()
    }))
  },
  filterLabelValues: function () {
    var t = this.playbook.get("labels");
    return _.includes(t, "*") ? ["*"] : _.intersection(t, this.playbook.get("all_labels"))
  },
  setActiveState: function (t, e) {
    e ? (this.playbook.get("active") && this.activeToggle.handleClick(), this.activeToggle.disable()) : this.activeToggle.enable()
  }
})
