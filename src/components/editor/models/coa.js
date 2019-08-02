import _ba from 'backbone'

export default _ba.Model.extend({
  defaults: {
    editMode: false,
    modified: false,
    saving: false,
    reloading: false,
    custom: false,
    frameState: 'closed',
    frameSplit: 'none',
    editorOpen: false,
    editorPosition: 'left',
    editorLock: false,
    editorData: {},
    debugOpen: false,
    panelOpen: false,
    notesOpen: false,
    resolveOpen: false,
    debugPosition: 'right',
    codeView: 'full',
    cleanCode: false,
    cleanGlobal: true,
    coaData: true,
    openSettings: false,
    requireComment: true,
    lastComment: '',
    globalBlockStart: 1,
    editorLineStart: 1,
    errorLine: 0,
    codeChanged: !1,
    propsChanged: !1,
    actionSelectMode: 'apps',
    actionSelectState: '',
    showContains: true,
    missingAssetCount: 0
  },
  initialize: function () {
    this.action_keys = {}
    this.block_cache = {}
    this.list_names = {}
    this.conversions = []
    this.missing_assets = []
    this.missing_asset_index = 0
    this.mapped_assets = []
    this.missing_message = ''
    this.on('change:editMode', this.editModeChange, this)
    this.on('change:errorLine', this.clearErrorLine, this)
  },
  frameState: function (t) {
    return typeof t !== 'undefined' && this.set('frameState', t), this.get('frameState')
  },
  frameSplit: function (t) {
    return "undefined" != typeof t && this.set("frameSplit", t), this.get("frameSplit")
  },
  isEditorOpen: function () {
    return this.get("editorOpen")
  },
  isDebugOpen: function () {
    return this.get("debugOpen")
  },
  setEditor: function (t) {
    this.set("editorOpen", t)
  },
  setDebug: function (t) {
    this.set("debugOpen", t)
  },
  editModeChange: function (t, e) {
    e ? this.dispatcher.trigger("mode:edit") : this.dispatcher.trigger("mode:view")
  },
  clearErrorLine: function (t, e) {
    0 === e && _.each(this.blocks.models, function (t) {
      t.errors = 0
    })
  }
})
