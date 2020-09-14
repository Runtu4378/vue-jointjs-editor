import config from '../../../config'
import EditMode from '../../../widgets/mixins/EditMode'
import ParamsContainer from './ParamsContainer'
import Container from '../../components/SelectMenu/Container'

const template = `
<h3>配置 <b><%- name %></b> 的 <b><%- action %></b></h3>
<div class="scroller-widget">
  <div class="scroller-content panel-scroll-content">
    <div class="template">
      <label>Template <i class="fa fa-info-circle"></i></label>
      <textarea class="format-template"><%= message %></textarea>
    </div>
    <div class="clear"></div>
  </div>
  <div class="scroller-track panel-scroll-track">
    <div class="scroller-handle panel-scroll-handle"></div>
  </div>
</div>
`

export const Parameter = Backbone.Model.extend({
  defaults: {
    value: '',
    type: '',
    position: 0,
  },
})

export default Backbone.View.extend(_.extend({}, EditMode, {
  className: 'action-config-template-field',
  trackClass: '.panel-scroll-track',
  handleClass: '.panel-scroll-handle',
  contentClass: '.panel-scroll-content',

  initialize: function ({ action }) {
    this.template = _.template(template)
    this.active = null
    this.cursorPos = -1

    this.block = this.blocks.getActive()
    this.fields = this.model.get('fields') || {
      message: '{0}',
      format: [''],
    }
    this.message = this.fields.message
    this.format = this.fields.format
    this.parameters = new Backbone.Collection(this.format.map((item, idx) => {
      return new Parameter({
        value: item,
        type: '',
        position: idx,
      })
    }))
    this.paramsView = new ParamsContainer({
      title: 'Template Parameters',
      parameters: this.parameters,
    })

    this.listenTo(this.dispatcher, 'select:toggle', this.toggleSelect)
    this.listenTo(this.dispatcher, 'config:select', this.setActiveField)
    this.listenTo(this.dispatcher, 'panel:close', this.closeSelect)
    this.listenTo(this.model, 'change:message', this.updateCode)
    this.listenTo(this.parameters, 'change', this.updateFormat)
    this.listenTo(this.parameters, 'reset add remove', this.checkParams)
  },
  remove: function () {
    this.updateTemplate()
    this.updateFormat()
    this.closeSelect()
    this.block = null
    this.parameters = null
    this.paramsView.remove()
    Backbone.View.prototype.remove.apply(this)
  },
  render: function () {
    this.$el.html(this.template({
      ...this.model.toJSON(),
      message: this.message,
    }))
    this.$el.find('div.scroller-content').append(this.paramsView.render().el)

    // 手动挂载事件
    this.delegateEvents({
      'click .fa-info-circle': 'openDocs',
      'change textarea': 'updateTemplate',
      'keyup textarea': 'getCursorPos',
      'click textarea': 'getCursorPos',
      'wheel': 'handleWheel',
      'mouseenter': 'showScroller',
      'mouseleave': 'hideScroller',
    })

    return this
  },

  updateTemplate: function () {
    var t = _.trim(this.$el.find('textarea').val())
    this.message = t
    this.updateVal()
  },
  updateFormat: function () {
    this.format = this.parameters.models.map(it => it.get('value'))
    this.updateVal()
  },
  updateVal: function () {
    this.block.set('fields', {
      message: this.message,
      format: this.format,
    })
  },
  updateCode: function () {
    this.dispatcher.trigger('block:change')
  },
  checkParams: function (t, e, i) {
    const length = this.parameters.length
    const dom = this.$el.find('textarea')
    let str = dom.val()

    if (length === 0) {
      const a = new RegExp(/\{0\}/, 'g')
      str = str.replace(a, '')
      this.removeParams()
    } else if (
      !i ||
      (i.hasOwnProperty('add') && i.add)
    ) {
      this.cursorPos > -1
        ? str = str.substr(0, this.cursorPos) + '{' + (length - 1) + '}' + str.substr(this.cursorPos, str.length)
        : str += '\n{' + (length - 1) + '}'
    } else if (i.hasOwnProperty('index') && i.index >= 0) {
      var r = '\\{' + length + '\\}'
      const a = new RegExp(r, 'g')
      str = str.replace(a, '')
    }
    str = _.trim(str)
    dom.val(str)
    this.message = str
    this.format = this.parameters.models.map(it => it.value)
    this.updateVal()
  },

  toggleSelect: function (target) {
    this.active = target
    this.closing = false

    if (this.selectView) {
      if (this.selectView.input !== target) {
        this.selectView.input = target
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
    $(`#${config.layouts.panelId}`).append(this.selectView.render().el)

    const position = this.$el.position()
    const realLeft = position.left + this.$el.outerWidth()
    const startLect = realLeft - this.selectView.$el.outerWidth()

    this.selectView.setPosition(startLect)
    this.selectView.animatePosition(realLeft, function () {
      that.selectView.open = true
    })
  },
  closeSelect: function () {
    if (this.selectView && !this.closing) {
      this.closing = true
      const that = this
      const position = this.$el.position()
      const left = this.fullClose
        ? -this.selectView.$el.outerWidth()
        : position.left + this.$el.outerWidth() - this.selectView.$el.outerWidth()
      this.selectView.animatePosition(left, function () {
        that.selectView && that.selectView.remove()
        that.selectView = null
        that.setActiveField(null)
      })
    }
  },

  setActiveField: function (t) {
    this.$el.find('.plain-input-widget').removeClass('active')
    if (this.active !== t) {
      this.closeSelect()
      this.active = t
    }
    t && t.$el.addClass('active')
  },
  getCursorPos: function (t) {
    var e = $(t.currentTarget).get(0)
    var i = 0
    if ('selectionEnd' in e) {
      i = e.selectionEnd
    } else if ('selection' in document) {
      e.focus()
      var n = document.selection.createRange()
      var s = document.selection.createRange().text.length
      n.moveStart('character', -e.value.length)
      i = n.text.length - s
    }
    this.cursorPos = i
  },
}))
