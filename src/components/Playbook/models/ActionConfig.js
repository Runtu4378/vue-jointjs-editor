export default Backbone.Model.extend({
  defaults: {
    id: '-',
    name: '',
    action: '',
    appid: '',
    app_name: '',
    app_version: '',
    product_vendor: '',
    product_name: '',
    fields: {},
    output: {},
    type: '',
    config_type: 'asset',
    active: false,
    loaded: false,
    missing: false,
    has_app: true,
  },
  asJSON: function () {
    return this.toJSON()
  },
})
