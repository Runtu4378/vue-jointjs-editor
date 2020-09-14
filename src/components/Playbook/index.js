import config from './config'

import Playbook from './models/Playbook'
import Coa from './models/Coa'
import CoaSettings from './models/CoaSettings'

import Apps from './collections/Apps'
import Actions from './collections/Actions'
import Blocks from './collections/Blocks'
import Artifacts from './collections/Artifacts'
import Templates from './collections/Templates'

import Manager from './Manager'
import Progress from './Progress'

import './font/Roboto.css'
import './libs/font-awesome/css/font-awesome.min.css'
import './styles/index.scss'

const template = `
<div class="content open">
  <div id="<%= headerId %>" class="cmc-header"></div>
  <div id="<%= rightPanelId %>" class="cmc-right-panel"></div>
  <div id="<%= stageContainerId %>" class="cmc-stage-container">
    <div id="<%= stageId %>" class="cmc-stage">
      <div class="editor-disabled">
        <div class="message">编辑器不可用</div>
      </div>
      <div id="<%= panelId %>" class="cmc-panel"></div>
      <div id="<%= paperId %>" class="cmc-paper"></div>
    </div>
  </div>
  <div id="<%= framesId %>" class="cmc-frames">
    <div id="<%= editorId %>" class="cmc-editor"></div>
    <div id="<%= debuggerId %>" class="cmc-debugger"></div>
  </div>
  <div id="<%= settingsId %>" class="cmc-settings"></div>
</div>
<div id="<%= notificationsId %>" class="cmc-notifications"></div>
<div id="<%= loaderId %>" class="cmc-loader">
  <div class="message">
    <div class="loader"></div>
    <div class="title">正在加载请稍候...</div>
    <span class="status">正在加载编辑器内容</span>
    <div class="error"></div>
  </div>
</div>
`

export default class PlayBook {
  /** 挂载dom的id */
  id = null
  /** 模式 */
  mode = 'view' // view: 查看模式、edit: 编辑模式
  /** playbookid */
  pid = ''
  // 关闭事件
  onClose = null

  constructor ({
    id,
    mode = 'view',
    pid = '',
    onClose,
  }) {
    this.id = id
    this.mode = mode
    this.pid = pid
    this.onClose = onClose

    this.initDOM()
    this.initBBHack()
    this.init()
  }

  /** 初始化布局相关属性 */
  initDOM () {
    const render = _.template(template)
    $(`#${this.id}`)
      .html(render(config.layouts))
      .addClass('cmc-container')
  }

  /** 初始化backbone上下文的hack */
  initBBHack () {
    const id = this.id
    const onClose = this.onClose

    // 在请求头中加入授权字段
    window.$.ajaxSetup({
      cache: false,
      complete: function (xhr, textStatus) {
        if (xhr.status === 401) {
          window.$Router.replace(`/login?redirect=${window.$Router.currentRoute.path}`)
        }
      },
    })

    const dispatcher = _.extend({}, Backbone.Events, {
      cid: 'dispatcher',
    })
    const playbook = new Playbook({
      id: this.pid,
    })
    const coa = new Coa({
      mode: this.mode,
    })
    const coaSettings = new CoaSettings()
    const artifacts = new Artifacts()

    const apps = new Apps()
    const actions = new Actions()
    const blocks = new Blocks()
    const templates = new Templates()

    const progress = new Progress()

    progress.set('正在初始化系统信息')

    _.each([
      Backbone.Collection.prototype,
      Backbone.Model.prototype,
      Backbone.View.prototype,
      Backbone.Router.prototype,
    ], function (base) {
      return _.extend(base, {
        COA_CONTAINER_ID: id,
        COA_ON_CLOSE: onClose,

        dispatcher,
        progress,

        playbook,
        coa,
        coaSettings,

        artifacts,
        apps,
        actions,
        blocks,
        templates,
      })
    })
  }

  /** 初始化项目 */
  init () {
    // 处理svg的兼容
    SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function (t) {
      return t.getScreenCTM().inverse().multiply(this.getScreenCTM())
    }

    this.manager = new Manager({ id: this.id })
  }

  /** 销毁实例 */
  destory () {
    this.manager.destory()

    _.each([
      Backbone.Collection.prototype,
      Backbone.Model.prototype,
      Backbone.View.prototype,
      Backbone.Router.prototype,
    ], function (base) {
      return _.extend(base, {
        COA_CONTAINER_ID: null,
        COA_ON_CLOSE: null,
        dispatcher: null,
        progress: null,

        playbook: null,
        coa: null,
        coaSettings: null,

        artifacts: null,
        apps: null,
        blocks: null,
        templates: null,
      })
    })
  }
}
