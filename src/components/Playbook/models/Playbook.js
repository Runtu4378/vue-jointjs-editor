// 剧本的数据结构

export default Backbone.Model.extend({
  url: function () {
    return '/api/playbook/playbooks/' + this.id + '/'
  },
  defaults: {
    id: '',
    name: '',
    description: '', // playbook描述
    info: '', // 代码块
    json: {}, // 流程图节点

    clean: true,
  },
  errors: {},
  initialize: function () {
    this.loaded = false

    this.on('sync', this.onSync, this)
    // this.on('change:name', this.markModified, this)
  },
  // 关联数据源的更改到Model
  onSync: function () {
    this.loaded = true
  },

  validate: function () {
    const errors = {}
    if (_.trim(this.get('name')) === '') {
      errors.name = 'Playbook name required'
    }
    this.errors = errors
    return Object.keys(this.errors).length === 0
      ? ''
      : 'error'
  },
  save: function (data, config = {}) {
    const reqConfig = {
      ...config,
      method: 'POST',
      contentType: 'application/json',
    }
    const pid = this.get('id')

    const reqData = _.clone(this.attributes)

    delete reqData.all_categories
    delete reqData.all_labels
    delete reqData.actions
    delete reqData.filters
    delete reqData.transforms
    delete reqData.all_tenants
    delete reqData.available_scm

    reqData.json = { joint: data }

    reqConfig.data = JSON.stringify(reqData)
    if (pid === '') {
      // 新增逻辑
    } else {
      // 更新逻辑
      reqConfig.url = `/api/playbook/playbooks/${pid}/`
      reqConfig.method = 'PUT'
    }

    return Backbone.Model.prototype.save.call(this, reqData, reqConfig)
  },
})
