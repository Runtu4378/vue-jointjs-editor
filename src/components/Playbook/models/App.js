// import Action from '../collections/Actions'

export default Backbone.Model.extend({
  defaults: {
    id: '',
    name: '',
    logoURL: '',
    actions: [],
  },
})
