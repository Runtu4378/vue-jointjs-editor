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
    this.graph = this.view.graph
    this.paper = this.view.paper
  }

  setData (data = []) {
    this.model.set({ collection: data })
  }
}
