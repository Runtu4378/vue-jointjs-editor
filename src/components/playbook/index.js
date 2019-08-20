/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'
import _lo from 'lodash'

import Manager from './manager'

export default class PlayBook {
  /** 挂载dom的id */
  id = null

  constructor ({
    id,
  }) {
    this.id = id
    this.initBBHack()
  }

  // 初始化backbone上下文的hack
  initBBHack () {
    const mountId = this.id // 编辑器挂载的节点id
    const manager = new Manager({
      mountId,
    })

    _lo.each([
      _bb.Collection.prototype,
      _bb.Model.prototype,
      _bb.View.prototype,
      _bb.Router.prototype,
    ], function (base) {
      return _lo.extend(base, {
        manager, // 主流程
      })
    })
  }
}
