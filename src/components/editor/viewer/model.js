/* eslint comma-dangle: ["error", "always-multiline"] */

import {
  Model,
} from 'backbone'

export default Model.extend({
  defaults: {
    id: null,
    collection: [],
  },

  initialize: function (props, context) {
    this.id = context.id
  },

  insertNode: function () {},
})
