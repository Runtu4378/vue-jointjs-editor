/* eslint comma-dangle: ["error", "always-multiline"] */

import {
  Model,
} from 'backbone'

export default Model.extend({
  defaults: {
    id: null,
  },

  initialize: function ({
    id,
  }, context) {
    this.id = id
  },
})
