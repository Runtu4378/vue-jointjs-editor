// 可视化编辑器的数据结构

export default Backbone.Model.extend({
  url: '/api/dataconfig/artifacts/',
  defaults: {
    list: [],
  },
  parse: function (resp) {
    const list = new Map()
    if (resp.data) {
      resp.data.forEach((str) => {
        const item = {
          value: `FIELD.${str}`,
          label: str,
          type: '',
        }
        list.set(str, item)
      })
    }
    return { list }
  },
})
