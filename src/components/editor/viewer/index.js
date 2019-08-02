/* eslint comma-dangle: ["error", "always-multiline"] */

import View from './view'
import Model from './model'
import Props from '../models/props'

export default class Viewer {
  props = null
  model = null
  view = null

  constructor ({
    id,
  }) {
    this.props = new Props()
    this.model = new Model({
      id,
    }, this)
    this.view = new View({
      id,
    }, this)
  }
}
