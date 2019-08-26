/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'

export default _bb.Model.extend({
  url: function () {
    return '/rest/app/' + this.id + '?pretty'
  },
  defaults: {
    name: '',
    product_name: '',
    type: '',
    is_configured: false,
    actions: [],
    logo: '',
    show_dark_logo: false,
    _pretty_dark_logo: '',
  },
})
