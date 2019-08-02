/* eslint comma-dangle: ["error", "always-multiline"] */

import View from './view'
import Model from './model'

export default class Viewer {
  props = null
  model = null
  view = null

  constructor ({
    id,
  }) {
    this.model = new Model({
      id,
    }, this)
    this.view = new View({
      id,
    }, this)
  }
}
