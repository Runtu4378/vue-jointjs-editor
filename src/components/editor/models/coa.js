/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'

import {
  each,
} from 'lodash'

export default _bb.Model.extend({
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
    codeChanged: false,
    propsChanged: false,
    actionSelectMode: 'apps',
    actionSelectState: '',
    showContains: true,
    missingAssetCount: 0,
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
  frameState: function (target) {
    if (typeof target !== 'undefined') {
      this.set('frameState', target)
    }
    return this.get('frameState')
  },
  frameSplit: function (target) {
    if (typeof target !== 'undefined') {
      this.set('frameSplit', target)
    }
    return this.get('frameSplit')
  },
  isEditorOpen: function () {
    return this.get('editorOpen')
  },
  isDebugOpen: function () {
    return this.get('debugOpen')
  },
  setEditor: function (target) {
    this.set('editorOpen', target)
  },
  setDebug: function (target) {
    this.set('debugOpen', target)
  },
  editModeChange: function (t, e) {
    if (e) {
      this.dispatcher.trigger('mode:edit')
    } else {
      this.dispatcher.trigger('mode:view')
    }
  },
  clearErrorLine: function (t, e) {
    if (e === 0) {
      each(this.blocks.models, function (t) {
        t.errors = 0
      })
    }
  },
})
