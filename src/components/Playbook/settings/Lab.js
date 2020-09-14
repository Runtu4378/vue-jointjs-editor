import Button from '../widgets/Button'

const template = `
<div class="title">Playbook</div>
<div class="settings-controls">
</div>
`

export default Backbone.View.extend({
  className: 'settings-lab',
  initialize: function () {
    this.template = _.template(template)

    this.submitWidget = new Button({
      style: 'btn-primary',
    })
    this.cancelWidget = new Button({
      label: '取消',
      action: 'playbook:cancel',
      style: 'btn-secondary',
    })
    this.settingWidget = new Button({
      label: '设置',
      action: 'playbook:settings',
      style: 'btn-secondary setting-btn',
    })
  },
  render: function () {
    this.$el.html(this.template())

    this.$el.find('.settings-controls').append(
      this.settingWidget.render().el,
      this.submitWidget.render().el,
      this.cancelWidget.render().el,
    )

    if (this.coa.get('editMode')) {
      this.setEditMode()
    } else {
      this.setViewMode()
    }

    return this
  },

  /** 编辑模式按钮设定 */
  setEditMode: function () {
    this.cancelWidget.show()
    this.submitWidget.label = '保存'
    this.submitWidget.action = 'playbook:save'

    this.submitWidget.render()
  },
  setViewMode: function () {
    this.submitWidget.hide()
  },
})
