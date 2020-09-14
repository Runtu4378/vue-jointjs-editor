import config from './config'

import Loader from './Loader'
import Header from './views/Header'
// import Comment from './views/Comment'
import Canvas from './Canvas'
import Panels from './panels/index'
import Frames from './frames/Manager'
import Settings from './settings/Manager'
import Factory from './code/Factory'

import Alert from './widgets/Alert'
import Notification from './widgets/Notification'

// 初始化相关
const initAbout = {
  /** 初始化默认状态 */
  initState: function () {
    this.appsLoaded = false
    this.actionsLoaded = false
    this.artifactsLoaded = false
    this.templatesLoaded = false
    this.playbookLoaded = false
  },
  /** 初始化数据 */
  initData: function () {
    this.apps.fetch({
      error: _.bind(this.appsError, this),
    })
    this.actions.fetch({
      error: _.bind(this.actionsError, this),
    })
    this.artifacts.fetch({
      error: _.bind(this.artifactsError, this),
    })
    this.templates.fetch({
      error: _.bind(this.templatesError, this),
    })
  },
  getPlaybookData: function () {
    this.playbook.fetch({
      error: _.bind(this.playbookError, this),
    })
  },
  /** 判断数据是否初始化完毕 */
  isReady: function () {
    if (
      // this.playbookLoaded &&
      // this.assetsLoaded &&
      this.appsLoaded &&
      this.actionsLoaded &&
      this.artifactsLoaded &&
      this.templatesLoaded &&
      this.playbookLoaded
    ) {
      console.log(this)
      this.render()
    }
  },
  appsReady: function () {
    this.appsLoaded = true
    this.isReady()
  },
  appsError: function (collection, response, options) {
    this.progress.error(`加载 app 数据失败: ${response.responseJSON.detail}`)
  },
  actionsReady: function () {
    this.actionsLoaded = true
    this.isReady()
  },
  actionsError: function (collection, response, options) {
    this.progress.error(`加载 action 数据失败: ${response.responseJSON.detail}`)
  },
  artifactsReady: function () {
    this.artifactsLoaded = true
    this.isReady()
  },
  artifactsError: function (collection, response, options) {
    this.progress.error(`加载 artifacts 数据失败: ${response.responseJSON.detail}`)
  },
  templatesReady: function () {
    this.templatesLoaded = true
    this.isReady()
  },
  templatesError: function (collection, response, options) {
    this.progress.error(`加载 templates 数据失败: ${response.responseJSON.detail}`)
  },
  playbookReady: function () {
    this.playbookLoaded = true
    this.isReady()
  },
  playbookError: function (collection, response, options) {
    this.progress.error(`加载 playbook 数据失败: ${response.responseJSON.detail}`)
  },
}
// app选择相关
const appSelectAbout = {
  /** app选择事件处理 */
  handleAppSelect: function (app) {
    const blocks = this.blocks.getActive()
    const appidNow = blocks.get('appid')
    const assetsLen = blocks.assets.length
    if (this.coa.get('editMode')) {
      if (appidNow === app.get('id')) {
        this.appSelectNextState()
        this.panels.update()
      } else if (assetsLen !== 0) {
        // 该节点已选择了一个app的情况
        const errMsg =
          '已有一个已配置到该节点的 ' +
          (blocks.get('app') ? 'app' : 'action') +
          ' 是否继续操作（会覆盖现有的配置）.'
        const config = {
          title: '更改配置?',
          message: errMsg,
          confirm: 'Confirm',
        }
        const callback = _.bind(this.appSelect, this)
        this.dispatcher.trigger('alert:show', config, {
          callback: callback,
          data: app,
        })
      } else {
        this.appSelect(app)
      }
    }
  },
  appSelectNextState: function (t) {
    this.coa.set('actionSelectState', 'app_actions')
  },
  appSelect: function (appModel) {
    const blocks = this.blocks.getActive()
    const appidNow = blocks.get('appid')
    this.appSelectNextState()
    if (appModel.get('id') !== appidNow) {
      blocks.clearConfig()
      blocks.set('action', '')
    }
    blocks.set({
      app: appModel.get('name'),
      appid: appModel.get('id'),
      state: this.coa.get('actionSelectState'),
    })
    this.panels.update()
  },
}
// action选择相关
const actionSelectAbout = {
  handleActionSelect: function (actionModel) {
    const blocks = this.blocks.getActive()
    const nowAction = blocks.get('action')
    if (this.coa.get('editMode')) {
      if (actionModel.get('action') === nowAction) {
        // action没变化
        this.actionSelectNextState()
        this.panels.update()
      } else if (nowAction !== '') {
        // action变化了
        const message = '该节点已有 action 配置，接下来的操作会覆盖原有设置。'
        const config = {
          title: '更改配置?',
          message,
          confirm: 'Confirm',
        }
        const callback = _.bind(this.actionSelect, this)
        this.dispatcher.trigger('alert:show', config, {
          callback,
          data: actionModel,
        })
      } else {
        this.actionSelect(actionModel)
      }
    }
  },
  actionSelectNextState: function () {
    this.coa.set('actionSelectState', 'app_action_config')
  },
  actionSelect: function (actionModel) {
    const block = this.blocks.getActive()
    const nowAction = block.get('action')
    const newAction = actionModel.get('name')
    const nowState = this.coa.get('actionSelectState')
    const actionNowExist = this.canvas.getNextBlockNumber(newAction)

    if (nowAction !== newAction) {
      block.clearConfig()
      // 重置app
      nowState === 'apps' && block.set({
        app: '',
        appid: '',
      })
      this.canvas.blockCleanup(block, nowAction)
    }

    block.set({
      title: actionModel.get('name'),
      action: actionModel.get('name'),
      number: actionNowExist,
    })
    this.actionSelectNextState()
    block.set('state', this.coa.get('actionSelectState'))
    this.panels.update()
  },
}
// 代码生成相关
const codeAbout = {
  updateEditorSingle: function () {
    const block = this.blocks.getActive()
    const cleanCode = typeof block !== 'undefined' && block.get('custom_code') === ''
    const codeView = this.coa.get('codeView')

    if (block && codeView !== 'full') {
      this.coa.get('editMode') && this.generateFullCode()
      const editorData = this.codeFactory.render(block, codeView)
      let lineStart = block.get('line_start')

      codeView === 'callback'
        ? lineStart = block.get('callback_start')
        : codeView === 'join' && (lineStart = block.get('join_start'))

      this.coa.set({
        editorData,
        cleanCode,
        editorLineStart: lineStart,
      })
      this.dispatcher.trigger('editor:update', editorData)
    } else {
      this.updateEditorFull()
    }
  },
  updateEditorFull: function (t) {
    const code = this.playbook.get('clean') && this.coa.get('editMode')
      ? this.generateFullCode(t)
      : this.playbook.get('info')
    const editorData = {
      title: 'Full Code',
      code,
    }
    this.coa.set({
      codeView: 'full',
      editorData,
      cleanCode: this.playbook.get('clean'),
      editorLineStart: 1,
    })
    this.dispatcher.trigger('editor:update', editorData)
    return code
  },
  generateCode: function (state) {
    if (this.playbook.get('clean')) {
      const code = this.updateEditorFull(state)
      this.playbook.set('info', code)
    }
  },
  generateFullCode: function (t) {
    this.updateAllConnections()
    const codeNow = this.codeFactory.renderFullPlaybook(t)
    codeNow !== this.playbook.get('info') && this.coa.set('modified', true)
    return codeNow
  },
  updateAllConnections: function () {
    this.canvas.updateAllConnections()
  },
}
// playbook保存相关
const playbookAbout = {
  cancelSave: function () {
    this.COA_ON_CLOSE && this.COA_ON_CLOSE()
  },
  savePlaybook: function (t) {
    const that = this
    this.dispatcher.trigger('notification:clear')
    this.dispatcher.trigger('panel:close')
    setTimeout(function () {
      that.validatePlaybook(t)
    }, 500)
  },
  validatePlaybook: function (t, e) {
    const availableScm = this.playbook.get('available_scm')
    const codeChanged = this.coa.get('codeChanged')
    if (
      this.playbook.get('scm_read_only') === true &&
      codeChanged &&
      availableScm < 1 &&
      !t
    ) {
      return void this.dispatcher.trigger('notification:show', {
        message: 'Cannot save playbook when its repository is read-only',
        autoHide: false,
        type: 'error',
      })
    }
    if (this.playbook.validate()) {
      for (var o in this.playbook.errors) {
        $('#' + o + '-widget').addClass('error')
      }
      $(`#${config.layouts.settingsId}`).find('.error').length > 0 && this.dispatcher.trigger('playbook:settings', true)
      this.coa.set('commentOpen', false)
    } else {
      this.generateCode(true)
      var a = _.find(availableScm, 'id', this.playbook.get('scm'))

      this.coa.get('propsChanged') && this.playbook.set('propsChanged', !0)

      if (
        this.playbook.id === '' ||
        (codeChanged && this.coa.get('requireComment')) ||
        (this.coa.get('propsChanged') && !a) ||
        t ||
        e
      ) {
        // this.comment = new Comment({
        //   callback: _.bind(this.doSave, this),
        //   saveAs: e,
        // })
        this.doSave()
      } else {
        this.doSave()
      }
    }
  },
  // 保存playbook
  doSave: function (t, n) {
    const that = this

    if (this.coa.get('saving')) {
      return
    }

    this.coa.set('saving', true)
    this.dispatcher.trigger('wait:show', {
      message: 'Saving Playbook',
    })

    this.playbook.save(this.canvas.graph.toJSON(), {
      error: function (t, e, i) {
        let message = that.getErrorMsg(e)
        message = message
          .replace('\n', '')
          .replace('Error:', '<br/>Error:')
          .replace(/E:\s/g, '<br/>E: ')
        that.dispatcher.trigger('notification:show', {
          message,
          autoHide: false,
          type: 'error',
        })
        that.coa.set('saving', false)
        that.blocks.lastActive && that.blocks.lastActive.set({
          active: true,
        })
      },
      success: function () {
        that.COA_ON_CLOSE && that.COA_ON_CLOSE()
      },
    })
  },
  getErrorMsg: function (response) {
    let errMsg = 'Error occurred while communicating with server'

    if (response.status === 403) {
      errMsg = '403: Forbidden<br/>Insufficient permissions or the session has expired.'
    } else if (response.status === 500) {
      errMsg = '500: Interval Server Error'
    } else if (response.status === 400) {
      errMsg = response.responseJSON.detail
    } else if (response.responseJSON) {
      errMsg = response.responseJSON.detail
    } else if (response.responseText) {
      errMsg = response.responseText
    }

    return errMsg
  },
}

export default Backbone.View.extend({
  el: '',

  initialize () {
    this.firstLoad = true
    this.codeFactory = new Factory()

    this.initEvent()

    if (this.coa.get('editMode')) {
      if (this.playbook.get('id') === '') {
        // 新文件编辑
        console.log('playbook新建')
        this.initState()
        this.playbookLoaded = true
        this.initData()
      } else {
        // playbook编辑
        console.log('playbook编辑')
        this.initState()
        this.initData()
        this.getPlaybookData()
      }
    } else {
      if (this.playbook.get('id') === '') {
        // 错误状态
        this.progress.error('缺少playbookid')
      } else {
        // playbook查看
        console.log('playbook查看')
        this.initState()
        this.initData()
        this.getPlaybookData()
      }
    }
  },

  render () {
    // 初始化组件
    if (this.firstLoad) {
      this.loader = new Loader()
      this.header = new Header()
      this.canvas = new Canvas({
        mainId: this.id,
      })
      this.panels = new Panels({
        canvas: this.canvas,
      })
      this.frames = new Frames()
      this.settings = new Settings()
      this.setInitialState()
      this.firstLoad = false
    }

    this.initEditState()

    return this
  },

  destory () {
    $('body').off('click', this.bodyEventFunc)
  },

  /// ----以下是自定义方法---
  ...initAbout,
  ...appSelectAbout,
  ...actionSelectAbout,
  ...codeAbout,
  ...playbookAbout,

  /** 更新编辑状态 */
  initEditState: function () {
    if (this.coa.get('editMode')) {
      if (this.playbook.get('id') === '') {
        // 新文件编辑
        this.editPlaybook()
      } else {
        // playbook编辑
        console.log('playbook编辑')
      }
    } else {
      if (this.playbook.get('id') === '') {
        // 错误状态
        this.progress.error('缺少playbookid')
      } else {
        // playbook查看
        console.log('playbook查看')
        this.editPlaybook()
      }
    }
  },
  /** 初始化事件监听 */
  initEvent: function () {
    // 更新并显示单个节点代码
    this.listenTo(this.dispatcher, 'code:update', this.updateEditorSingle)
    // 更新并显示全部代码
    this.listenTo(this.dispatcher, 'code:full', this.updateEditorFull)

    // 数据初始化
    this.listenTo(this.apps, 'sync', this.appsReady)
    this.listenTo(this.actions, 'sync', this.actionsReady)
    this.listenTo(this.artifacts, 'sync', this.artifactsReady)
    this.listenTo(this.templates, 'sync', this.templatesReady)
    this.listenTo(this.playbook, 'sync', this.playbookReady)

    // 显示提示信息
    this.listenTo(this.dispatcher, 'notification:show', this.showNotification)
    // 显示alert弹窗
    this.listenTo(this.dispatcher, 'alert:show', this.showAlert)
    // Action节点选择app
    this.listenTo(this.dispatcher, 'app:select', this.handleAppSelect)
    // Action节点选择某个action
    this.listenTo(this.dispatcher, 'action:select', this.handleActionSelect)
    // 取消编辑
    this.listenTo(this.dispatcher, 'playbook:cancel', this.cancelSave)
    // 保存playbook
    this.listenTo(this.dispatcher, 'playbook:save', this.savePlaybook)

    this.bodyEventFunc = _.bind(this.onBodyClick, this)
    $('body').on('click', this.bodyEventFunc)
  },

  setInitialState: function () {
    this.updateEditorFull()
    this.loader.checkAssets()
  },

  editPlaybook: function () {
    this.dispatcher.trigger('notification:clear')
    this.blocks.getActive() && this.panels.update()
  },
  onBodyClick: function (t) {
    this.dispatcher.trigger('body:click', t)
  },
  showNotification: function (config) {
    /* eslint-disable-next-line */
    new Notification(config)
  },
  showAlert: function (content, config) {
    /* eslint-disable-next-line */
    new Alert(content, config)
  },
})
