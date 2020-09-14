import ModalAction from '../models/Action'

// 全量的action列表
export default Backbone.Collection.extend({
  url: function () {
    return '/api/playbook/menu/action/'
  },
  model: ModalAction,

  initialize: function (appid) {
    this.appid = appid
  },

  parse: function (response) {
    const baseItem = response.data || {}
    const arr = Object.keys(baseItem)
    const result = []

    _.each(arr, key => {
      const actions = baseItem[key] || []

      for (let i = 0; i < actions.length; i += 1) {
        const action = actions[i]
        result.push({
          ...action,
          appid: key,
        })
      }
    })
    return result
  },
})
