/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'
import _lo from 'lodash'

import Manager from './manager'

import Playbook from './models/playbook'

import Blocks from './collections/blocks'

export default class PlayBook {
  /** 挂载dom的id */
  id = null

  constructor ({
    id,
  }) {
    this.id = id
    this.initBBHack()
    this.init()
  }

  // 初始化backbone上下文的hack
  initBBHack () {
    const dispatcher = _lo.extend({}, _bb.Events, {
      cid: 'dispatcher',
    })
    const playbook = new Playbook()
    const blocks = new Blocks()

    _lo.each([
      _bb.Collection.prototype,
      _bb.Model.prototype,
      _bb.View.prototype,
      _bb.Router.prototype,
    ], function (base) {
      return _lo.extend(base, {
        dispatcher,
        playbook,
        blocks,
      })
    })
  }

  init () {
    const mountId = this.id // 编辑器挂载的节点id

    this.manager = new Manager({
      mountId,
    })
  }
}
