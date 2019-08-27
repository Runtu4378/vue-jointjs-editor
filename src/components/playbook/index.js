/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'
import _lo from 'lodash'

import Manager from './manager'
import Progress from './progress'

import Playbook from './models/playbook'
import Coa from './models/coa'
import CoaSetting from './models/coa_settings'

import Blocks from './collections/blocks'
import Apps from './collections/apps'

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
    const progress = new Progress()
    progress.set('Processing system information')
    const playbook = new Playbook()
    const coa = new Coa()
    /* eslint-disable-next-line */
    const coa_settings = new CoaSetting()
    const blocks = new Blocks()
    const apps = new Apps()

    _lo.each([
      _bb.Collection.prototype,
      _bb.Model.prototype,
      _bb.View.prototype,
      _bb.Router.prototype,
    ], function (base) {
      return _lo.extend(base, {
        dispatcher,
        progress,
        playbook,
        coa,
        coa_settings,
        blocks,
        apps,
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
