import Tempalte from '../models/Template'

export default Backbone.Collection.extend({
  url: '/api/playbook/template/',
  model: Tempalte,

  parse: function (response) {
    const data = response.data || {}
    const keys = Object.keys(data)

    return keys.map(key => {
      return {
        type: key,
        info: data[key]['info'],
        json: data[key]['json'],
      }
    })
  },
})
