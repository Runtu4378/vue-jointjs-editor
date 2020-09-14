/* 这个js是放逻辑块的 */
import config from '../../config'
import logicgroup from './LogicGroup' // i
import scrollable from '../../widgets/mixins/Scrollable' // s
import Container from '../components/SelectMenu/Container'
// <div class='buttons'><% if (count < 5) { %><button>Add Condition</button><% } %></div>

const template = `
    <div class='scroller-content logic-scroller-content'>
    <div class='logic-groups'></div>
    <div class='clear'></div>
    </div>
    <div class='scroller-track logic-scroller-track'>
    <div class='scroller-handle logic-scroller-handle'></div>
    </div>`
// a
export default Backbone.View.extend(_.extend({}, scrollable, {
  className: 'logic-container',
  trackClass: '.logic-scroller-track',
  handleClass: '.logic-scroller-handle',
  contentClass: '.logic-scroller-content',

  initialize: function (block) {
    this.template = _.template(template)
    this.subviews = []
    this.active = null
    this.closing = false
    this.selectView = null
    
    this.listenTo(this.model.outputs, 'add remove', this.render)
    this.listenTo(this.coa, 'change:editMode', this.editModeChange)
    this.listenTo(this.dispatcher, 'document:resize', this.setCutoff)
    this.listenTo(this.dispatcher, 'select:toggle', this.toggleSelect)
    this.listenTo(this.dispatcher, 'config:select', this.setActiveField)
    this.listenTo(this.dispatcher, 'panel:close', this.closeSelect)

    this.initScrollable()
  },
  remove: function () {
    this.cleanup(), this.removeScrollable(), Backbone.View.prototype.remove.apply(this)
  },
  render: function () {
    const block = this.blocks.getActive()
    var t = this
    this.cleanup()
      this.$el.html(this.template(
        _.extend(this.model.toJSON(), {
          count: this.model.outputs.length
        })
      ))
    var e = this.$el.find('.logic-groups')
    // 手动挂载事件
    this.delegateEvents({
      'click button.elif': 'addElif',
      'click button.else': 'addElse',
      wheel: 'handleWheel',
      mouseenter: 'showScroller',
      mouseleave: 'hideScroller',
      'click .logic': 'closeSelectMenu',
      'click .comparison': 'closeSelectMenu'
    })
    return _.each(this.model.outputs.models, function (n, s) {
      var group = new logicgroup({
        model: n,
        index: s
      });
      e.append(group.render().el), t.subviews.push(group)
    }),
      this.renderScrollable(), setTimeout(function () {
        t.setCutoff()
      }, 0),
      this
  },
  cleanup: function () {
    _.invoke(this.subviews, 'remove'), 
    this.subviews = [], 
    this.active = null, 
    this.dispatcher.trigger('config:select'), 
    this.editModeChange(this.coa, this.coa.get('editMode'))
  },
  editModeChange: function (t, e) {
    e ? this.$el.removeClass('disabled') : this.$el.addClass('disabled')
  },
  addElif: function () {
    this.blocks.getActive().addOutput('if'), 
    this.blocks.getActive().set('warn', ''), 
    this.render()
  },
  addElse: function () {
    this.blocks.getActive().addOutput("else"), 
    this.blocks.getActive().set("warn", ""), 
    this.render()
  },
  setCutoff: function () {
    var t = this.$el.height() - 75;
    _.each(this.$el.find('div.comparison'), function (e) {
      var i = $(e);
      i.offset().top > t && i.addClass('popup')
    })
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
    var that = this;
    this.selectView = new Container({
      model: this.model,
    })

    this.selectView.input = this.active
    this.selectView.filteringOn = this.filteringOn
    $(`#${config.layouts.stageId}`).append(this.selectView.render().el)

    const position = this.$el.position()
    const left = position.left + this.$el.parent().parent('.panel-wrapper').outerWidth()
    const selectViewLeft = left - this.selectView.$el.outerWidth()
    this.selectView.setPosition(selectViewLeft)
    this.selectView.animatePosition(left, function () {
      that.selectView.open = true
    })
  },
  closeSelect: function () {
    if (this.selectView) {
      const that = this
      const position = this.$el.position()
      const moveX = this.fullClose
        ? -this.selectView.$el.outerWidth()
        : position.left + this.$el.parent().parent('.panel-wrapper').outerWidth() - this.selectView.$el.outerWidth()

      this.selectView.animatePosition(moveX, function () {
        that.selectView && that.selectView.remove()
        that.selectView = null
        that.fullClose = false
        that.setActiveField(null)
      })
    }
  },
  setActiveField: function (t) {
    this.$el.find('.plain-input-widget').removeClass('active'), this.active !== t && (this.closeSelect(), this.active = t), t && t.$el.addClass('active')
  },
  closeSelectMenu: function () {
    this.dispatcher.trigger('config:select')
  },
  enableBodyClick: function () {
    this.listenTo(this.dispatcher, 'body:click', this.onBodyClick)
  },
  disableBodyClick: function () {
    this.stopListening(this.dispatcher, 'body:click', this.onBodyClick)
  },
  onBodyClick: function (t) {
    if (t) {
      var e = $(t.target);
      0 === e.closest('div.select-menu, div.logic-container').length && this.closeSelect()
    }
  }
})
)