/* eslint comma-dangle: ["error", "always-multiline"] */

import _backbone from 'backbone'
import _lodash from 'lodash'
import $ from 'jquery'

import CefProxy from '../models/cef_meta_proxy'
import UserInfoProxy from '../models/user_info_proxy'

// "views/manager"
export default _backbone.View.extend({
  initialize: function () {
    this.listenTo(this.dispatcher, 'action:select', this.confirmActionSelect)
    this.listenTo(this.dispatcher, 'app:select', this.confirmAppSelect)
    this.listenTo(this.dispatcher, 'playbook:save', this.savePlaybook)
    this.listenTo(this.dispatcher, 'playbook:saveAs', this.playbookSaveAs)
    this.listenTo(this.dispatcher, 'playbook:edit', this.confirmEditPlaybook)
    this.listenTo(this.dispatcher, 'playbook:cancel', this.cancelChanges)
    this.listenTo(this.dispatcher, 'playbook:current', this.currentVersion)
    this.listenTo(this.dispatcher, 'playbook:change:code', this.markCodeChange)
    this.listenTo(this.dispatcher, 'playbook:change:props', this.markPropsChange)
    this.listenTo(this.dispatcher, 'code:update', this.updateEditor)
    this.listenTo(this.dispatcher, 'code:full', this.updateEditorFull)
    this.listenTo(this.dispatcher, 'code:revert', this.revertCode)
    this.listenTo(this.dispatcher, 'code:global', this.showGlobalCode)
    this.listenTo(this.dispatcher, 'code:full:undo', this.revertFullCode)
    this.listenTo(this.dispatcher, 'block:change', this.updateBlock)
    this.listenTo(this.dispatcher, 'block:active', this.setActiveBlock)
    this.listenTo(this.dispatcher, 'callplaybook:select', this.playbookSelect)
    this.listenTo(this.dispatcher, 'resolve:open', this.openAssetMapper)
    this.listenTo(this.dispatcher, 'websocket:start', this.startWebsocket)
    this.listenTo(this.dispatcher, 'websocket:stop', this.stopWebsocket)
    this.listenTo(this.dispatcher, 'foundnew:asset', this.fetchNewAsset)
    this.listenTo(this.dispatcher, 'foundnew:app', this.fetchNewApp)
    this.listenTo(this.system_assets, 'sync', this.assetsReady)
    this.listenTo(this.app_actions, 'sync', this.actionsReady)
    this.listenTo(this.playbook, 'sync', this.playbookReady)
    this.listenTo(this.apps, 'sync', this.appsReady)
    this.listenTo(this.cefs, 'sync', this.cefReady)
    this.listenTo(this.apis, 'sync', this.apisReady)
    this.listenTo(this.playbook, 'change:clean', this.cleanState)
    this.listenTo(this.playbook, 'change:python', _lodash.throttle(_lodash.bind(this.pythonState, this), 1e3))
    this.listenTo(this.playbook, 'change:description', this.markCodeChange)
    this.listenTo(this.playbook, 'change:notes change:name change:labels change:category', this.markPropsChange)
    $('body').on('click', _lodash.bind(this.onBodyClick, this))
    $('body').on('keydown', _lodash.bind(this.onKeydown, this))
    $(window).on('resize', _lodash.throttle(_lodash.bind(this.onResize, this), 200))
    $(window).on('beforeunload', _lodash.bind(this.pageUnload, this))
    this.system_assets.fetch({
      error: this.asset_error,
    })
    this.app_actions.fetch({
      error: this.action_error,
    })
    this.apis.fetch({
      error: this.api_error,
    })
    this.dlists.fetch({
      error: this.list_error,
    })
    this.apps.fetch({
      error: this.app_error,
    })
    this.panel = null
    this.websocket = null
    this.playbookLoaded = false
    this.actionsLoaded = false
    this.assetsLoaded = false
    this.appsLoaded = false
    this.cefLoaded = false
    this.firstLoad = true
    this.action_types.add([
      {
        name: 'Investigate',
        type: 'investigate',
        color: '#654796',
      },
      {
        name: 'Correct',
        type: 'correct',
        color: '#E65100',
      },
      {
        name: 'Contain',
        type: 'contain',
        color: '#3D9959',
      },
      {
        name: 'Generic',
        type: 'generic',
        color: '#5094D4',
      },
    ])
    this.cef_proxy = new CefProxy()
    this.cef_proxy.fetch()
    this.user_info = new UserInfoProxy()
    this.user_info.fetch()
    this.code_factory = new g
    this.system_tags.fetch()
  },
  render: function () {
    return this.firstLoad ? (this.progress.set("Rendering playbook editor"), this.loader = new s, this.firstLoad = !1, this.header = new o, this.canvas = new n,
      this.frames = new a, this.panels = new r({
        canvas: this.canvas
      }), this.setInitialState()) : (this.header.render(), this.coa.get("reloading") ? (this.canvas.reload(), this.dispatcher.trigger("wait:close"), this.dispatcher.trigger("editor:init"), this.coa.set("missingAssetCount", 0), this.coa.missing_assets = [], this.coa.missing_asset_index = 0, this.coa.mapped_assets = [], this.coa.set("reloading", !1), this.setInitialState()) : this.canvas.resetCanvas()), "edit" === this.playbook.mode && "" === this.playbook.get("current_id") ? (this.playbook.set("coa_schema_version", SCHEMA_VERSION), this.editPlaybook(), this.coa.set({
      codeChanged: !0
    })) : (this.loader.checkForNewerVersion(), this.viewPlaybook(), this.coa.trigger("change:editMode")), "" !== this.playbook.get("current_id") && this.header.setArchiveMode(), self.coa.set({
      modified: !1,
      codeChanged: !1,
      propsChanged: !1
    }), "" !== this.playbook.get("name") && this.canvas.scaleOnLoad(), this
  },
  setInitialState: function () {
    var t = this.playbook.get("coa_data").joint;
    "" === this.playbook.get("name") || "undefined" != typeof t && 0 !== t.cells.length ? this.coa.set("coaData", !0) : this.coa.set("coaData", !1), this.playbook.get("clean") || this.coa.get("coaData") ? this.coa.set({
      editorLock: !1,
      cleanCode: !0
    }) : this.dispatcher.trigger("editor:lock"), this.updateEditorFull(), this.loader.checkAssets()
  },
  pageUnload: function (t) {
    if (this.coa.get("modified")) {
      var e = t || window.event,
        i = "This playbook has been modified.";
      return e && (e.returnValue = "This playbook has been modified."), i
    }
  },
  setActiveBlock: function (t) {
    i.each(this.blocks.where({
      active: !0
    }), function (e) {
      t !== e && e.set({
        active: !1
      })
    }), t.set({
      active: !0
    })
  },
  cleanState: function (t, e) {
    e ? $("#stage").removeClass("dirty") : $("#stage").addClass("dirty")
  },
  pythonState: function (t, e) {
    this.coa.get("clean") || this.clearBlockErrors()
  },
  onKeydown: function (t) {
    var e = t.keyCode || t.which;
    27 === e ? this.dispatcher.trigger("key:escape") : 83 === e && t.ctrlKey && this.coa.get("editMode") && ($(document.activeElement).blur(), this.dispatcher.trigger("body:click", t), this.savePlaybook(!0)), this.dispatcher.trigger("key:press", t, e)
  },
  confirmActionSelect: function (t) {
    var e = this.coa.get("actionSelectState"),
      n = this.blocks.getActive(),
      s = n.get("action"),
      o = n.assets.length;
    if (this.coa.get("editMode"))
      if (s === t.get("action")) this.actionSelectNextState(e), this.panels.update();
      else if (0 !== o || n.get("has_custom")) {
      var a = "There is an existing " + (n.get("action") ? "action" : "app") + " configured. This will remove ";
      o > 0 && n.get("has_custom") ? a += "the current asset configuration and custom code " : o > 0 ? a += "the current asset configuration " : n.get("has_custom") && (a += "the current custom code "), a += "for this block.";
      var r = {
          title: "Change configuration?",
          message: a,
          confirm: "Confirm"
        },
        l = i.bind(this.actionSelect, this);
      this.dispatcher.trigger("alert:show", r, {
        callback: l,
        data: t
      })
    } else this.actionSelect(t)
  },
  actionSelect: function (t) {
    var e = this.coa.get("actionSelectState"),
      i = this.blocks.getActive(),
      n = this.action_types.findWhere({
        type: t.get("type")
      });
    n || (n = this.action_types.findWhere({
      type: "generic"
    }));
    var s = i.get("action"),
      o = this.canvas.getNextBlockNumber(t.get("action"));
    s !== t.get("action") && (i.clearConfig(), "actions" === e && i.set({
      app: "",
      appid: ""
    }), this.canvas.blockCleanup(i, s)), i.set({
      title: n.get("name"),
      action: t.get("action"),
      action_type: t.get("type"),
      state: "action_assets",
      number: o
    }), this.canvas.setShowActionNumber(t.get("action")), this.actionSelectNextState(e), i.set("state", this.coa.get("actionSelectState")), this.panels.update()
  },
  actionSelectNextState: function (t) {
    "app_actions" === t ? this.coa.set("actionSelectState", "app_action_assets") : this.coa.set("actionSelectState", "action_assets")
  },
  confirmAppSelect: function (t) {
    var e = this.coa.get("actionSelectState"),
      n = this.blocks.getActive(),
      s = n.get("appid"),
      o = n.assets.length;
    if (this.coa.get("editMode"))
      if (s === t.get("appid")) this.appSelectNextState(e), this.panels.update();
      else if (0 !== o || n.get("has_custom")) {
      var a = "There is an existing " + (n.get("app") ? "app" : "action") + " configured. This will remove ";
      o > 0 && n.get("has_custom") ? a += "the current asset configuration and custom code " : o > 0 ? a += "the current asset configuration " : n.get("has_custom") && (a += "the current custom code "), a += "for this block.";
      var r = {
          title: "Change configuration?",
          message: a,
          confirm: "Confirm"
        },
        l = i.bind(this.appSelect, this);
      this.dispatcher.trigger("alert:show", r, {
        callback: l,
        data: t
      })
    } else this.appSelect(t)
  },
  appSelect: function (t) {
    var e = this.blocks.getActive(),
      i = e.get("appid"),
      n = this.coa.get("actionSelectState");
    this.appSelectNextState(n), i !== t.get("appid") && (e.clearConfig(), "app" === n && e.set("action", "")), e.set({
      app: t.get("name"),
      appid: t.get("appid"),
      state: this.coa.get("actionSelectState")
    }), this.panels.update()
  },
  appSelectNextState: function (t) {
    "action_apps" === t ? this.coa.set("actionSelectState", "action_app_config") : this.coa.set("actionSelectState", "app_actions")
  },
  playbookSelect: function (t) {
    var e = this.blocks.getActive(),
      i = this.canvas.getNextBlockNumber(e.get("playbook"));
    e.set({
      number: i
    }), this.canvas.setShowPlaybookNumber(e.get("playbook"))
  },
  savePlaybook: function (t) {
    var e = this;
    this.coa.get("commentOpen") || (this.coa.set("commentOpen", !0), this.dispatcher.trigger("notification:clear"), this.dispatcher.trigger("panel:close"), setTimeout(function () {
      e.validatePlaybook(t)
    }, 500))
  },
  playbookSaveAs: function () {
    var t = this;
    this.coa.get("commentOpen") || (this.coa.set("commentOpen", !0), this.dispatcher.trigger("notification:clear"), this.dispatcher.trigger("panel:close"), setTimeout(function () {
      t.validatePlaybook(!1, !0)
    }, 500))
  },
  validatePlaybook: function (t, e) {
    var n = this.playbook.get("available_scm"),
      s = this.coa.get("codeChanged");
    if (this.playbook.get("scm_read_only") === !0 && s && 1 > n && !t) return void this.dispatcher.trigger("notification:show", {
      message: "Cannot save playbook when its repository is read-only",
      autoHide: !1,
      type: "error"
    });
    if (this.playbook.validate()) {
      for (var o in this.playbook.errors) $("#" + o + "-widget").addClass("error");
      $("#right-panel").find(".error").length > 0 && this.dispatcher.trigger("playbook:settings", !0), this.coa.set("commentOpen", !1)
    } else {
      this.generateCode(!0);
      var a = i.find(n, "id", this.playbook.get("scm"));
      this.coa.get("propsChanged") && this.playbook.set("propsChanged", !0), "" === this.playbook.id || s && this.coa.get("requireComment") || this.coa.get("propsChanged") && !a || t || e ? this.comment = new l({
        callback: i.bind(this.cancelRuns, this),
        saveAs: e
      }) : this.cancelRuns()
    }
  },
  cancelRuns: function (t, e) {
    if (this.playbook.was_active && !this.playbook.get("active")) {
      var n = {
          title: "Cancel running playbooks?",
          message: "Any currently running instances of this playbook will be cancelled.",
          cancel: "No",
          confirm: "Yes"
        },
        s = i.bind(this.confirmCancelRuns, this);
      this.dispatcher.trigger("alert:show", n, {
        callback: s,
        cancel: !0
      })
    } else this.playbook.set("cancel_runs", !1), this.doSave(t, e)
  },
  confirmCancelRuns: function (t, e, i) {
    this.playbook.set("cancel_runs", t), this.doSave(e, i)
  },
  saveAsDraft: function (t) {
    t.draftMode = !0, this.doSave(!0, t)
  },
  doSave: function (t, n) {
    var s = this;
    if (!this.coa.get("saving")) {
      if (this.coa.set("saving", !0), this.comment && this.comment.remove(), this.coa.set("errorLine", 0), this.clearBlockErrors(), this.dispatcher.trigger("header:close"), this.dispatcher.trigger("wait:show", {
          message: "Saving Playbook"
        }), "" === this.playbook.get("comment")) {
        var o = this.coa.get("lastComment") ? "Saved: " + this.coa.get("lastComment") : "";
        this.playbook.set("comment", o)
      }
      this.playbook.save(this.canvas.graph.toJSON(), {
        saveAs: t,
        newPBInfo: n,
        error: function (t, e, i) {
          var n = s.getErrorMsg(e);
          s.showLineError(n), n = n.replace("\n", "").replace("Error:", "<br/>Error:").replace(/E\:\s/g, "<br/>E: "), s.dispatcher.trigger("notification:show", {
            message: n,
            autoHide: !1,
            type: "error"
          }), this.blocks.lastActive && this.blocks.lastActive.set({
            active: !0
          })
        },
        success: function (i, n, o) {
          t || (e.history.navigate("/playbook/" + i.id, {
            trigger: !1,
            replace: !0
          }), s.viewPlaybook(), s.coa.set({
            modified: !1,
            codeChanged: !1,
            propsChanged: !1
          }), s.playbook.set({
            comment: "",
            propsChanged: !1
          }), s.playbook.backup = s.playbook.get("python"))
        }
      }).always(function () {
        s.coa.set({
          saving: !1,
          commentOpen: !1
        }), s.dispatcher.trigger("wait:close"), t || s.updateEditor()
      }).error(function (e) {
        if (t) {
          var o = s.getErrorMsg(e),
            a = {
              title: "Save As",
              cancel: "Cancel",
              modalClass: "save-as"
            },
            r = {};
          i.contains(o, "syntax") ? (a.confirm = "Save As Draft", a.message = "Playbook contains syntax errors. Would you like to continue saving a copy in draft mode?", r = {
            callback: s.saveAsDraft.bind(s),
            data: n
          }) : (a.message = o, a.confirm = "Close", a.confirmOnly = !0, r = {
            cancel: !0
          }), s.dispatcher.trigger("alert:show", a, r)
        }
      })
    }
  },
  getErrorMsg: function (t) {
    var e = "Error occurred while communicating with server";
    return 403 === t.status ? e = "403: Forbidden<br/>Insufficient permissions or the session has expired." : 500 === t.status ? e = "500: Interval Server Error" : t.responseJSON ? e = t.responseJSON.message : t.responseText && (e = t.responseText), e
  },
  currentVersion: function () {
    window.location = "/playbook/" + this.playbook.get("current_id")
  },
  openAssetMapper: function () {
    "" === this.playbook.get("current_id") && (this.asset_mapper = new c, $("#panel").addClass("wide").html(this.asset_mapper.render().el), this.asset_mapper.openPanel())
  },
  showLineError: function (t) {
    var e = /Error\:\sLine\:\s+(\d+),/,
      i = t.match(e);
    if (null != i) {
      var n = i[1],
        s = this.findBlockByLine(n);
      this.coa.set("errorLine", n), s && (s.errors = n, s.set("status", "error"))
    }
  },
  clearBlockErrors: function () {
    i.each(this.blocks.where({
      status: "error"
    }), function (t) {
      t.set({
        status: ""
      })
    })
  },
  viewPlaybook: function () {
    this.coa.set("editMode", !1)
  },
  confirmEditPlaybook: function () {
    if (this.coa.get("resolveOpen")) {
      var t = "Any unapplied asset mapping changes will be lost.",
        e = {
          title: "Exit asset mapping?",
          message: t,
          confirm: "Confirm"
        },
        n = i.bind(this.editPlaybook, this);
      this.dispatcher.trigger("alert:show", e, {
        callback: n
      })
    } else this.editPlaybook()
  },
  editPlaybook: function () {
    this.dispatcher.trigger("notification:clear"), this.loader.validate(), this.canvas.runConversions(), this.coa.set("editMode", !0), this.blocks.getActive() && this.panels.update()
  },
  cancelChanges: function () {
    if (this.dispatcher.trigger("notification:clear"), this.dispatcher.trigger("panel:close"), this.dispatcher.trigger("frame:close"), this.coa.get("codeChanged") || this.coa.get("propsChanged")) {
      var t = {
          title: "Discard playbook changes?",
          message: "There are unsaved changes to this playbook. All changes will be lost.",
          confirm: "Confirm"
        },
        e = i.bind(this.confirmCancelChanges, this);
      this.dispatcher.trigger("alert:show", t, {
        callback: e
      })
    } else this.confirmCancelChanges()
  },
  confirmCancelChanges: function () {
    this.dispatcher.trigger("header:close"), this.dispatcher.trigger("wait:show", {
      message: "Resetting Playbook"
    }), this.coa.set("errorLine", 0), this.clearBlockErrors(), this.playbook.set("clean", !0), this.coa.set({
      reloading: !0,
      editMode: !1
    }), this.playbook.fetch()
  },
  revertCode: function () {
    var t, e, n = this.coa.get("codeView");
    this.coa.set("errorLine", 0), this.clearBlockErrors(), "full" === n ? (t = {
      title: "Revert custom playbook code?",
      message: "This will revert custom code on the playbook. Customization made at block level will not be reverted.",
      confirm: "Confirm"
    }, e = i.bind(this.revertFullCode, this)) : "global" === n ? (t = {
      title: "Revert global block code?",
      message: "This will clear all code in the global code block.",
      confirm: "Confirm"
    }, e = i.bind(this.revertGlobalCode, this)) : (t = {
      title: "Revert custom " + n + " code?",
      message: "This will revert all custom code in this " + n + " function to generated code.",
      confirm: "Confirm"
    }, e = i.bind(this.revertBlockCode, this)), this.dispatcher.trigger("alert:show", t, {
      callback: e
    })
  },
  revertFullCode: function () {
    this.playbook.set("clean", !0), this.markCodeChange(), this.updateEditorFull()
  },
  revertGlobalCode: function () {
    this.playbook.set("code_block", ""), this.showGlobalCode()
  },
  revertBlockCode: function () {
    var t = this.blocks.getActive(),
      e = this.coa.get("codeView");
    t && ("block" === e ? t.set("custom_code", "") : "callback" === e ? t.set("custom_callback", "") : "join" === e && t.set("custom_join", ""), this.dispatcher.trigger("code:update"))
  },
  showGlobalCode: function () {
    var t = {
      title: "Global Code Block",
      code: this.playbook.get("code_block"),
      global: !0
    };
    this.coa.set({
      codeView: "global",
      editorData: t,
      cleanCode: !0,
      editorLineStart: this.coa.get("globalBlockStart") + 3
    }), this.dispatcher.trigger("editor:update", t)
  },
  updateBlock: function (t) {
    var e = t ? t : this.blocks.getActive();
    e && e.errors > 0 && this.coa.set("errorLine", 0), this.markCodeChange(), this.updateEditor()
  },
  updateAllConnections: function () {
    this.canvas.updateAllConnections()
  },
  updateEditor: function () {
    var t = this.blocks.getActive(),
      e = "undefined" == typeof t || "" === t.get("custom_code") ? !0 : !1,
      i = this.coa.get("codeView");
    if (t && "full" !== i) {
      this.coa.get("editMode") && this.generateFullCode();
      var n = this.code_factory.render(t, i),
        s = t.get("line_start");
      "callback" === i ? s = t.get("callback_start") : "join" === i && (s = t.get("join_start")), this.coa.get("editMode") || ("block" !== i || t.get("has_custom_block") ? "join" !== i || t.get("has_custom_join") ? "callback" === i & !t.get("has_custom_callback") && (n.code = t.get("callback_code")) : n.code = t.get("join_code") : n.code = t.get("block_code")), this.coa.set({
        editorData: n,
        cleanCode: e,
        editorLineStart: s
      }), this.dispatcher.trigger("editor:update", n)
    } else this.updateEditorFull()
  },
  updateEditorFull: function (t) {
    var e;
    e = this.playbook.get("clean") && this.coa.get("editMode") ? this.generateFullCode(t) : this.playbook.get("python");
    var i = {
      title: "Full Code",
      code: e
    };
    return this.coa.set({
      codeView: "full",
      editorData: i,
      cleanCode: this.playbook.get("clean"),
      editorLineStart: 1
    }), this.dispatcher.trigger("editor:update", i), e
  },
  generateFullCode: function (t) {
    this.updateAllConnections();
    var e = this.code_factory.renderFullPlaybook(t);
    return e !== this.playbook.get("python") && this.coa.set("modified", !0), e
  },
  findBlockByLine: function (t) {
    var e = null;
    return i.each(this.blocks.models, function (i) {
      return t >= i.get("line_start") && t < i.get("line_end") ? (e = i, !1) : void 0
    }), e
  },
  onBodyClick: function (t) {
    this.dispatcher.trigger("body:click", t)
  },
  onResize: function (t) {
    this.dispatcher.trigger("document:resize", t)
  },
  generateCode: function (t) {
    if (this.playbook.get("clean")) {
      var e = this.updateEditorFull(t);
      this.playbook.set("python", e)
    }
  },
  playbookReady: function () {
    this.playbookLoaded = !0, this.isReady()
  },
  cefReady: function () {
    this.cefLoaded = !0, this.isReady()
  },
  appsReady: function () {
    this.appsLoaded = !0, this.isReady()
  },
  actionsReady: function () {
    this.actionsLoaded = !0, this.isReady()
  },
  assetsReady: function () {
    var t = this;
    this.progress.set("Processing system asset data"), t.asset_types.reset(), t.tags.reset(), i.each(this.system_assets.models, function (e) {
      var n = e.get("type"),
        s = t.asset_types.findWhere({
          name: n
        });
      s ? s.set("actions", i.union(e.get("actions"), s.get("actions"))) : t.asset_types.add([{
        name: n,
        actions: e.get("actions")
      }]);
      var o = e.get("tags");
      i.each(o, function (e) {
        t.tags.where({
          name: e
        }).length || t.tags.add([{
          name: e
        }])
      })
    }), t.asset_types.sort(), t.tags.sort(), this.assetsLoaded = !0, this.isReady()
  },
  apisReady: function () {},
  isReady: function () {
    var t = this;
    this.playbookLoaded && this.actionsLoaded && this.assetsLoaded && this.appsLoaded && this.cefLoaded && (i.each(this.apps.models, function (e) {
      var n = t.system_assets.where({
        product_name: e.get("product_name")
      });
      n.length > 0 && i.filter(n[0].get("actions"), function (t) {
        return "on poll" !== t && "test connectivity" !== t
      }).length > 0 && e.set("is_configured", !0)
    }), this.actions.setHasAssets(), this.apps.setActions(), this.render())
  },
  asset_error: function (t, e, i) {
    this.progress.error("Failed to load Asset data: View Assets permission required")
  },
  action_error: function (t, e, i) {
    this.progress.error("Failed to load Action data: View Apps permission required")
  },
  api_error: function (t, e, i) {
    this.progress.error("Failed to load API data: View Cases permission required")
  },
  list_error: function (t, e, i) {
    this.progress.error("Failed to load List data: View Custom Lists permission required")
  },
  app_error: function (t, e, i) {
    this.progress.error("Failed to load App data: View Apps permission required")
  },
  markModified: function (t, e) {
    this.coa.get("editMode") && this.coa.set({
      modified: !0
    })
  },
  markCodeChange: function (t, e) {
    this.coa.get("editMode") && this.coa.set({
      modified: !0,
      codeChanged: !0
    })
  },
  markPropsChange: function (t, e) {
    this.coa.get("editMode") && this.coa.set({
      modified: !0,
      propsChanged: !0
    })
  },
  startWebsocket: function (t, e) {
    this.stopWebsocket();
    var n = this,
      t = t,
      e = e;
    "undefined" == typeof t && (t = {
      asset_id: "*",
      app_id: "*"
    }), "undefined" == typeof e && (e = function (t) {
      var t = JSON.parse(t.data);
      i.each(t, function (t) {
        void 0 !== t.asset_id && n.dispatcher.trigger("foundnew:asset", t.asset_id, t.app_info), void 0 !== t.app && n.dispatcher.trigger("foundnew:app", t.app)
      })
    }), this.websocket = this.initWebsocket(PHANTOM_WS_URI, t, e)
  },
  initWebsocket: function (t, e, i) {
    var n = new WebSocket(t),
      s = {
        register: !0
      };
    return $.extend(s, e), n.onerror = function (t) {
      console.warn(t)
    }, n.onopen = function () {
      n.send(JSON.stringify(s))
    }, n.onmessage = i, window.onbeforeunload = function () {
      n.close(), n = null
    }, n
  },
  stopWebsocket: function () {
    this.websocket && (this.websocket.close(), this.websocket = null)
  },
  fetchNewAsset: function (t, e) {
    var n = this;
    if ("undefined" == typeof n.system_assets.find({
        id: t
      })) {
      var s = new d({
        id: t
      });
      s.on("sync", function () {
        if (n.system_assets.add(s), n.system_assets.sort(), i.each(s.get("actions"), function (t) {
            var e = n.actions.find({
              action: t
            });
            "undefined" != typeof e && e.set("has_assets", !0)
          }), e[0] && e[0].id) {
          var t = n.apps.find({
            id: e[0].id
          });
          t.get("is_configured") || t.set({
            is_configured: !0
          })
        }
        n.coa.missing_assets.length > 0 && n.asset_mapper.render()
      }), s.fetch({
        url: "/coa/asset/" + s.get("id")
      })
    }
  },
  fetchNewApp: function (t) {
    var e = this;
    if ("undefined" == typeof e.apps.find({
        id: t
      })) {
      var n = new p({
        id: t
      });
      n.on("sync", function () {
        e.apps.add(n), e.apps.sort(), $.ajax({
          url: "/rest/app_action?_filter_app=" + t,
          dataType: "json",
          type: "get",
          success: function (t) {
            var s = t.data,
              o = [];
            i.each(s, function (t) {
              o.push(t.action), "undefined" == typeof e.actions.find({
                action: t.action
              }) && e.actions.add(new f(t))
            }), n.set({
              actions: i.uniq(n.get("actions").concat(o))
            }), e.render()
          },
          error: function (t) {}
        }), $.ajax({
          url: '/rest/asset?_filter_product_name="' + n.get("product_name") + '"&_filter_product_vendor="' + n.get("product_vendor") + '"',
          dataType: "json",
          type: "get",
          success: function (n) {
            var s = n.data;
            i.each(s, function (i) {
              e.fetchNewAsset(i.id, [{
                id: t
              }])
            })
          },
          error: function (t) {}
        }), e.coa.missing_assets.length > 0 && e.asset_mapper.render()
      }), n.fetch()
    }
  }
})
