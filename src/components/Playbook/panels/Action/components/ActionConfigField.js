import config from '../../../config'

import EditMode from '../../../widgets/mixins/EditMode'
import InputPlain from '../../../widgets/InputPlain'
import Container from '../../components/SelectMenu/Container'

const template = `
<h3>配置 <b><%- name %></b> 的 <b><%- action %></b></h3>
<div class="scroller-widget">
  <div class="scroller-content">
    <div class="inputs">
      <div class="loading">Loading<i class="fa fa-spinner fa-spin"></i></div>
    </div>
    <div class="clear"></div>
    <% if (loaded) { %>
      <div class="controls">
      <% if (name) { %><a class="done btn btn-primary">保存</a><% } %>
      <% if (active) { %><a class="delete btn btn-secondary hidden">删除</a><% } %>
      <div class="clear"></div>
    </div>
    <% } %>
  </div>
  <div class="scroller-track">
    <div class="scroller-handle"></div>
  </div>
</div>
<div class="notch"></div>
`

export default Backbone.View.extend(_.extend({}, EditMode, {
  className: 'action-config-field',
  initialize: function ({ action }) {
    this.template = _.template(template)

    this.action = action
    this.block = this.blocks.getActive()
    this.selectView = null
    this.fullClose = false

    this.contains = []
    this.other_configs = []

    this.configOpen = false
    this.configView = null

    this.listenTo(this.dispatcher, 'asset:update', this.saveConfig)
    this.listenTo(this.dispatcher, 'select:toggle', this.toggleSelect)
    this.listenTo(this.dispatcher, 'panel:close', this.closeFull)
  },
  remove: function () {
    this.closeFull()
    Backbone.View.prototype.remove.apply(this)
  },
  render: function () {
    const that = this
    const loaded = !!this.action
    const required_params = {}
    const activeValues = this.block.get('active_values')

    let ifConfig = this.block.assets.findWhere({
      asset_name: this.model.get('name'),
    })

    if (!ifConfig) {
      ifConfig = this.block.assets.findWhere({
        name: this.model.get('name'),
      })
    }

    const nowField = ifConfig
      ? ifConfig.get('fields')
      : this.model.get('missing')
        ? this.model.get('fields')
        : {}

    this.$el.html(this.template({
      ...this.model.toJSON(),
      active: !!ifConfig,
      loaded,
    }))
    // 手动挂载事件
    this.delegateEvents({
      'click .delete': 'deleteConfig',
      'click .done': 'closeConfig',
      'wheel': 'handleWheel',
      'mouseenter': 'showScroller',
      'mouseleave': 'hideScroller',
    })

    this.fields = {}
    if (!loaded) { return this }

    const dom = this.$el.find('.inputs')
    const parameters = this.action.get('parameters')

    dom.empty()
    _.each(parameters, (pa) => {
      const { name, data_type, required, description } = pa

      const ifOther = !!that.other_configs[name]
      const value = nowField[name]
        ? nowField[name]
        : ifOther && activeValues[name]
          ? activeValues[name] : ''
      const placeholder = required
        ? `${data_type} (required) ${description}`
        : `${data_type} (optional) ${description}`
      const data = []

      required && (required_params[name] = true)

      data.push({
        name: 'artifacts',
        group: 'artifacts',
        fields: this.artifacts.get('list'),
      })

      const parameters = that.block.get('parameters')
      _.each(parameters, function (pa) {
        pa.fields.size > 0 && data.push({
          name: pa.name,
          group: pa.group,
          fields: pa.fields,
        })
      })

      if (data_type === 'boolean') {
        console.error('暂无 boolean的输入控件')
      } else {
        const field = new InputPlain({
          label: name,
          value,
          name,
          placeholder,
          linked: false,
          action: 'asset:update',
          data,
          filtered: [],
          tooltip: true,
        })
        this.fields[name] = field
        dom.append(field.render().el)
      }
    })

    this.block.set('required_params', required_params)
    this.setEditMode()
    return this
  },

  toggleSelect: function (target) {
    this.active = target
    if (this.selectView) {
      if (this.selectView.input !== target) {
        this.selectView.input = target
        this.selectView.contains = this.contains[this.active.field_name]
        this.selectView.render()
      } else {
        this.closeSelect()
      }
    } else {
      this.openSelect()
    }
    this.setActiveField(target)
  },
  openSelect: function () {
    const that = this

    this.selectView = new Container({
      model: this.model,
    })
    this.selectView.input = this.active
    this.selectView.filteringOn = this.filteringOn
    this.selectView.contains = this.contains[this.active.field_name]

    $(`#${config.layouts.stageId}`).append(this.selectView.render().el)

    const position = this.$el.position()
    const left = position.left + this.$el.parent('.panel-wrapper').outerWidth()
    const selectViewLeft = left - this.selectView.$el.outerWidth()

    this.selectView.setPosition(selectViewLeft)
    this.selectView.animatePosition(left, function () {
      that.selectView.open = true
    })
  },
  closeFull: function () {
    this.fullClose = true
    this.closeSelect()
  },
  closeSelect: function () {
    if (this.selectView) {
      const that = this
      const position = this.$el.position()
      const moveX = this.fullClose
        ? -this.selectView.$el.outerWidth()
        : position.left + this.$el.parent('.panel-wrapper').outerWidth() - this.selectView.$el.outerWidth()

      this.selectView.animatePosition(moveX, function () {
        that.selectView && that.selectView.remove()
        that.selectView = null
        that.fullClose = false
        that.setActiveField(null)
      })
    }
  },
  setActiveField: function (t) {
    const that = this

    if (this.active !== t) {
      this.closeSelect()
      this.active = t
    }

    _.each(_.keys(this.fields), function (t) {
      that.fields[t].$el.removeClass('active')
    })

    t && this.active.$el.addClass('active')
  },

  // TODO 暂时移除删除asset功能
  deleteConfig: function () {
    var t = this.model.get('config_type')
    var e = t === 'app'
      ? this.model.get('app_name')
      : this.model.get('asset_name')

    this.block.missing_assets = _.filter(this.block.missing_assets, function (t) {
      return t !== e
    })
    this.block.removeAsset(e)
    this.model.set('active', false)
    this.dispatcher.trigger('panel:close')
    this.dispatcher.trigger('block:change')
  },
  closeConfig: function () {
    this.saveConfig()
    this.dispatcher.trigger('panel:close')
  },
  saveConfig: function () {
    const that = this

    if (this.block) {
      const activeValues = this.block.get('active_values')

      if (!this.block.assets.findWhere({ name: this.model.get('name') })) {
        this.block.assets.add(this.model)
      }

      const fields = {}

      _.each(this.fields, function (t, n) {
        activeValues[n] = t.value
        fields[n] = t.value
      })

      this.model.set({
        fields: fields,
      })
      this.block.set('active_values', activeValues)
      this.block.set('warn', '')

      _.each(this.block.assets.models, function (model) {
        if (model.cid !== that.model.cid) {
          const fields = model.get('fields')

          _.each(Object.keys(fields), function (t) {
            t in activeValues && (fields[t] = activeValues[t])
          })
          model.set('fields', fields)
        }
      })
      // this.block.set('state', this.coa.get('actionSelectState'))
      this.dispatcher.trigger('block:change')
    }
  },
}))
