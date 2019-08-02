/* eslint comma-dangle: ["error", "always-multiline"] */

import View from './view'
import Model from './model'

export default class Viewer {
  id = null
  model = null
  view = null

  constructor ({
    id,
  }) {
    this.id = id
    this.model = new Model({}, this)
    this.view = new View({}, this)
  }
}
