/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'
import $ from 'jquery'
import * as joint from 'jointjs'

import {
  StartEndModel,
  StartEndView,
} from '../nodes/StartEnd'

export default _bb.View.extend({
  el: '',
  initialize: function (id) {
    this.el = `#${id}`
    this.mountNodes()
    this.render()
  },
  render: function () {
    $(this.el).html('<h1>hello</h1>')
  },
  mountNodes: function () {
    joint.shapes['cmChart'] = {}
    joint.shapes['cmChart'].StartEnd = StartEndModel
    joint.shapes['cmChart'].StartEndView = StartEndView
  },
})
