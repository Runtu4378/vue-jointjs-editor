/* eslint comma-dangle: ["error", "always-multiline"] */

import { Model } from 'backbone'
import {
  cloneDeep,
} from 'lodash'

export default Model.extend({
  defaults: {
    collection: [],
  },

  initialize: function () {
    //
  },

  /** 增加节点 */
  addNode: function (node) {
    if (node) {
      const collection = cloneDeep(this.get('collection'))
      // 更新或新增
      collection.push(node)
      this.set('collection', collection)
      // console.log(this.get('collection'))
      // console.log(collection)
    }
  },
})
