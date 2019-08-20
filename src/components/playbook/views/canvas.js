/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'
import $ from 'jquery'

export default _bb.View.extend({
  initialize: function (id) {
    this.render(id)
  },
  render: function (id) {
    $(`#${id}`).html('<h1>hello</h1>')
  },
})
