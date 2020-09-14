// 可视化编辑器的数据结构

export default Backbone.Model.extend({
  defaults: {
    editMode: false, // 是否编辑模式

    blockX: 0, // 新添加的节点的x坐标
    panelOpen: false, // 是否已打开panel

    frameState: 'closed', // frame的状态：closed：收起
    editorOpen: false, // 代码编辑器的状态，激活和关闭

    codeView: 'full', // 代码粒度: full(全局)
    editorData: {}, // 编辑器内容
    editorLineStart: 1, // 开始行
  },
  initialize: function ({
    mode,
  }) {
    if (mode === 'view') {
      this.set('editMode', false)
    } else if (mode === 'edit') {
      this.set('editMode', true)
    }

    this.actionMap = new Map()

    this.on('change:editMode', this.editModeChange, this)
  },

  editModeChange: function (t, state) {
    if (state) {
      this.dispatcher.trigger('mode:edit')
    } else {
      this.dispatcher.trigger('mode:view')
    }
  },
  /** 设置或获取frameState */
  frameState: function (inState) {
    typeof inState !== 'undefined' && this.set('frameState', inState)
    return this.get('frameState')
  },
  setEditor: function (state) {
    this.set('editorOpen', state)
  },
  isEditorOpen: function () {
    return this.get('editorOpen')
  },
})
