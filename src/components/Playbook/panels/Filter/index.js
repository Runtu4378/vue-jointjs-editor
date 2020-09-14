import PanelBase from '../Base'
import Connection from './components/connection' // n
// import Menu from './components/advanced_settings/menu' // s
import LogicContainer from './LogicContainer' // o

const template = `
<div class="title-bar">  
<span class="configure">Configure</span>  
<span class="panel-title"><%= title %></span></div>
<div class="panel-content"></div>
`

export default PanelBase.extend({
  className: 'panel-wrapper filter-panel-wrapper',
  initialize: function () {
    PanelBase.prototype.initialize.apply(this, arguments)
    this.template = _.template(template)
  },
  remove: function () {
    this.connection && this.connection.remove()
    this.logic && this.logic.remove()

    PanelBase.prototype.remove.apply(this)
  },
  render: function () {
    const block = this.blocks.getActive()
    this.$el.html(this.template({
      title: block.getDisplayName(),
    }))
    var e = this.$el.find('.panel-content')
    this.connection = new Connection()

    this.$el.find('.title-bar').before(this.connection.render().el)
    this.logic = new LogicContainer({
      model: block,
    })
    e.append(this.logic.render().el)
    return this
  },
})
