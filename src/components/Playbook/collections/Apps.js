import ModelsApp from '../models/App'

export default Backbone.Collection.extend({
  url: '/api/playbook/menu/app/',
  model: ModelsApp,
  comparator: function (t) {
    return t.get('name')
  },
  parse: function (t) {
    return t.data
  },
})
