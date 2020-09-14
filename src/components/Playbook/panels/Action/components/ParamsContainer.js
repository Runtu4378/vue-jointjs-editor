import Param from './Param'
import { Parameter } from './ActionConfigTemplateField'

const template = `
<label><%= label %></label>
<div class="params-list"></div>
`

export default Backbone.View.extend({
  className: 'params-container',
  events: {
    'update-sort': 'updateSort',
  },
  initialize: function ({
    title,
    canRemoveAll = true,
    parameters,
  }) {
    this.title = title
    this.canRemoveAll = canRemoveAll

    this.template = _.template(template)
    this.block = this.blocks.getActive()
    this.paramViews = []

    this.parameters = parameters

    this.listenTo(this.dispatcher, 'format:add', this.addParam)
    this.listenTo(this.dispatcher, 'format:remove', this.removeParam)
  },
  render: function () {
    const that = this

    this.$el.html(this.template({
      label: this.title,
    }))

    if (this.block) {
      const dom = this.$el.find('.params-list')
      const count = this.parameters.length

      _.each(this.parameters.models, function (item, idx) {
        const pa = new Param({
          model: item,
          index: idx + 1,
          count: count,
          can_remove: that.canRemoveAll,
        })
        that.paramViews.push(pa)
        dom.append(pa.render().el)
      })
    }

    return this
  },

  addParam: function () {
    var t = this.parameters.length
    this.parameters.add(new Parameter({
      position: t,
    }))
    this.render()
  },
  removeParam: function (t) {
    this.parameters.remove(t)
    this.render()
  },
})
