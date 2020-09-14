import InputPlain from '../../../widgets/InputPlain'

const template = `
<div class="handle"><span class="pos"><%= index-1 %></span><i class="fa fa-bars"></i></div>
<div class="input"></div>
<div class="control"><% if (count > 1 || can_remove) { %><i class="fa fa-times"></i><% } %><% if (index == count) { %><i class="fa fa-plus"></i><% } %></div>
`

export default Backbone.View.extend({
  className: 'param',
  events: {
    'click .fa-plus': 'addParam',
    'click .fa-times': 'removeParam',
    'drop': 'drop',
  },
  initialize: function ({
    index,
    count,
    can_remove,
  }) {
    this.template = _.template(template)
    this.block = this.blocks.getActive()
    this.index = index
    this.count = count
    this.can_remove = can_remove
  },
  render: function () {
    const data = []
    const parameters = this.block.get('parameters')

    this.$el.html(this.template({
      index: this.index,
      count: this.count,
      can_remove: this.can_remove,
    }))

    data.push({
      name: 'artifacts',
      group: 'artifacts',
      fields: this.artifacts.get('list'),
    })
    _.each(parameters, function (pa) {
      pa.fields.size > 0 && data.push({
        name: pa.name,
        group: pa.group,
        fields: pa.fields,
      })
    })

    this.menu = new InputPlain({
      model: this.model,
      name: 'value',
      placeholder: 'Select a parameter',
      value: this.model.get('value'),
      tooltip: !0,
      action: 'format:update',
      data: data,
    })
    this.$el.find('.input').append(this.menu.render().el)

    return this
  },

  addParam: function () {
    this.dispatcher.trigger('format:add')
  },
  removeParam: function () {
    this.dispatcher.trigger('format:remove', this.model)
  },
})
