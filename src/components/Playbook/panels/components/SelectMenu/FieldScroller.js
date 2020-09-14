import Scroller from '../../../widgets/Scroller'

export default Scroller.extend({
  attachItems: function () {
    const listStrArr = []
    let renderStr = ''

    for (let item of this.fields.values()) {
      listStrArr.push('<li class="item" data-value="' + _.escape(item.value) + '">' + _.escape(item.label) + '</li>')
    }

    renderStr = listStrArr.length === 0
      ? '<li class="empty">No matching parameters</li>'
      : listStrArr.join('')

    this.$el.find('ul').append(renderStr)
  },
})
