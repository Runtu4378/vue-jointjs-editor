const template = `
<div class="key left">Editor</div>
<div class="chevron left"></div>
<div class="value left"></div>
<div class="frame-controls">
  <div class="close"><i class="fa fa-times"></i></div>
  <div class="compress"><i class="fa fa-compress"></i></div>
</div>
`

// 视图的事件绑定在 Editor.js 中定义
export default Backbone.View.extend({
  className: 'editor-header',
  initialize: function () {
    this.title = ''
    this.template = _.template(template)

    this.listenTo(this.dispatcher, 'editor:update', this.updateTitle)
    this.listenTo(this.playbook, 'change:clean', this.setClose)
    this.listenTo(this.coa, 'change:coaData', this.setClose)
    this.listenTo(this.coa, 'change:frameState', this.frameState)
  },
  render: function () {
    this.$el.html(this.template())
    return this
  },

  /// 以下为自定义方法
  /** 更新标题 */
  updateTitle: function (model) {
    const title = model ? model.title : ''
    let fileName = 'Function'

    if (title === '') {
      fileName = 'Editor'
    } else if (this.coa.get('fullCode')) {
      fileName = 'Playbook'
    }

    this.$el.find('div.value').html(title)
    this.$el.find('div.key').html(fileName)
  },
  setClose: function (t, status) {
    if (status) {
      this.$el.find('.close').show()
      this.coa.frameState() === 'full' && this.$el.find('.compress').show()
    } else if (!this.coa.get('coaData')) {
      this.$el.find('.close').hide()
      this.$el.find('.compress').hide()
    }
  },
  frameState: function (t, state) {
    if (state === 'full' && this.coa.get('coaData')) {
      this.$el.find('.compress').show()
    } else {
      this.$el.find('.compress').hide()
    }
  },
})
