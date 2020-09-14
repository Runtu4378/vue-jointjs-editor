import config from '../config'
import {
  Model,
  View,
} from './Base.js'
import AssetConfigs from '../collections/AssetConfigs'

const itemWidth = config.gridSize * 9
const itemHeight = config.gridSize * 5

export const ActionModel = Model.extend(_.extend({}, {
  markup: `<g class="rotatable">
  <g class="inPorts"/><g class="outPorts"/>
  <g class="scalable"></g>
  <rect class="background"/>
  <rect class="color-band"/>
  <text class="title"/>
  <rect class="status"/>
  <text class="message"/>
  <text class="number"/>
  <text class="action name"/>
  <g class="btn code"><image/></g>
  <g class="btn delete"><image/><title>Delete action</title></g>
  <g class="error"><image/></g>
</g>
`,
  defaults: _.defaultsDeep({
    type: 'coa.Action',
    size: {
      width: itemWidth,
      height: itemHeight,
    },
    inPorts: ['in'],
    outPorts: ['out'],
    attrs: {
      '.': {
        magnet: false,
      },
      '.port-body': {
        r: 10,
        magnet: true,
      },
      '.color-band': {
        fill: config.colors.header,
        fillOpacity: 1,
        x: 1,
        y: 1,
        width: 178,
        height: 29,
      },
      '.background': {
        fill: config.colors.background,
        stroke: config.colors.border,
        fillOpacity: 1,
        strokeWidth: 2,
        width: itemWidth,
        height: itemHeight,
        x: 0,
        y: 0,
        rx: 3,
        ry: 3,
        filter: {
          name: 'dropShadow',
          args: {
            dx: 2,
            dy: 2,
            blur: 2,
            opacity: 0.3,
          },
        },
      },
      'text.title': {
        fill: '#FFFFFF',
        fontSize: 10,
        fontFamily: 'Roboto',
        fontWeight: 600,
        text: '',
        width: 104,
        height: 29,
        ref: '.background',
        refX: 8,
        refY: 11,
        textAnchor: 'left',
      },
      'g.error image': {
        xlinkHref: '',
        ref: '.background',
        refX: 154,
        refY: 80,
        width: 16,
        height: 13,
      },
      'text.number': {
        fill: '#FFFFFF',
        fontSize: 12,
        fontFamily: 'Roboto',
        fontWeight: 600,
        text: '',
        ref: '.rotatable',
        refY: 14,
        refX: 170,
        textAnchor: 'end',
      },
      'text.action': {
        fill: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Roboto',
        fontWeight: 300,
        text: '',
        width: 104,
        ref: '.background',
        height: 20,
        refY: 40,
        refX: 8,
        textAnchor: 'left',
      },
      '.status': {
        fill: '#0083FF',
        width: 99,
        height: 19,
        ref: '.background',
        refY: 102,
        refX: 0,
        rx: 3,
        ry: 3,
        opacity: 0,
      },
      'text.message': {
        fill: '#FFFFFF',
        fontSize: 12,
        fontFamily: 'Roboto',
        fontWeight: 300,
        ref: '.background',
        refY: 105,
        refX: 5,
        opacity: 0,
      },
      'g.delete image': {
        xlinkHref: `${config.staticPrefix}/block_delete.svg`,
        ref: '.background',
        refY: -12,
        refX: 168,
        width: 26,
        height: 26,
        opacity: 0.8,
        filter: {
          name: 'dropShadow',
          args: {
            dx: 1,
            dy: 1,
            blur: 2,
            opacity: 0.2,
          },
        },
      },
      'g.code image': {
        xlinkHref: `${config.staticPrefix}/block_icon_code_light_off.svg`,
        ref: '.background',
        refY: 78,
        refX: 11,
        width: 17,
        height: 13,
      },
      '.port-body circle': {
        magnet: true,
      },
      '.inPorts circle': {
        type: 'input',
        ref: '.background',
        refY: config.gridSize * 2,
        fill: config.portBgColor,
      },
      '.outPorts circle': {
        type: 'output',
        ref: '.background',
        refX: itemWidth,
        refY: config.gridSize * 2,
        fill: config.portBgColor,
      },
    },

    name: 'action',
    state: 'action',

    app: '', // 挂载的app的名称
    appid: '', // 挂载的app的id

    action: '', // 挂载的action名称

    show_number: false,
    message: '',
    approver: '',
    reviewer: '',

    delay: false,
    color: '',
    active_keys: {},
    active_values: {},
    required_params: {}, // 必填项配置项
    callsback: true,
  }, Model.prototype.defaults),

  initialize: function () {
    Model.prototype.initialize.apply(this, arguments)

    this.assets = new AssetConfigs()
    this.missing_assets = []
    this.missing_assets_data = []

    this.initEvent()

    this.set('message', '正在配置...')

    this.code = '# Action'
  },

  // 初始化事件监听
  initEvent: function () {
    this.on('change:title', function (node, title) {
      node.attr('.title/text', title)
    })
    this.on('change:color', function (node, color) {
      node.attr('.color-band/fill', color)
    })
    this.on('change:action', function (node, action) {
      const functionName = this.getFunctionName()
      node.attr('.action/text', action)
      node.set('previous_name', functionName)
      node.set('name', action)
      node.set('title', functionName)
      // TODO 实现code绑定
      node.markCodeChange()
      this.generateMenuData()
    })
    this.on('change:message', function (t, e) {
      t.attr('.message/text', e)
    })

    this.on('change:active', function (t, active) {
      active && this.set('status', 'active')
      if (active && this.coa.get('editMode')) {
        t.attr('.status/opacity', 1)
        t.attr('.message/opacity', 1)
        t.attr('.background/height', 120)
      } else {
        t.attr('.status/opacity', 0)
        t.attr('.message/opacity', 0)
        t.attr('.background/height', 100)
        if (!active) {
          this.errors > 0
            ? this.set('status', 'error')
            : this.warnings.length > 0
              ? this.set('status', 'warn')
              : this.set('status', '')
        }
      }
    })

    this.on('change:status', function (node, status) {
      let i = this.coaSettings.getBlockBorderColor()
      if (status === 'active') {
        i = this.coaSettings.strokeColors[status]
      } else if (this.errors > 0) {
        i = this.coaSettings.strokeColors.error
        node.attr({
          'g.error image': {
            'xlink:href': `${config.staticPrefix}/block_icon_error.svg`,
          },
        })
      } else if (this.warnings.length > 0) {
        i = this.coaSettings.strokeColors.warn
        node.attr({
          'g.error image': {
            'xlink:href': `${config.staticPrefix}/block_icon_warn.svg`,
          },
        })
      }
      if (status === 'warn' || status === 'error') {
        node.attr('g.error/opacity', 1)
      } else {
        node.attr('g.error/opacity', 0)
      }
      node.attr('.background/stroke', i)
    })

    this.on('change:message', function (node, message) {
      node.attr('.message/text', message)
    })

    this.on('change:custom_code', function (node, code) {
      if (code === '') {
        node.attr({
          'g.code image': {
            'xlink:href': `${config.staticPrefix}/block_icon_code_light_off.svg`,
            opacity: 1,
          },
        })
      } else {
        node.attr({
          'g.code image': {
            'xlink:href': `${config.staticPrefix}/block_icon_code_light_on.svg`,
            opacity: 1,
          },
        })
      }
      this.set('warn', !1)
    })

    // this.listenTo(this.action, 'change', this.generateMenuData)
    this.listenTo(this.coa, 'change:editMode', this.updateBlockState)
  },

  generateMenuData: function () {
    // const that = this
    const functionName = this.getFunctionName()
    const menuData = {
      name: functionName,
      group: 'action results',
      fields: null,
    }
    const fields = new Map()
    const appid = this.get('appid')
    const action = this.get('action')

    if (appid !== '' && action !== '') {
      const targetAction = this.actions.findWhere({
        appid: `${appid}`,
        name: action,
      })
      if (!targetAction) {
        return
      }
      const output = targetAction.get('output')
      _.each(output, function (ot) {
        const path = ot.data_path
        fields.set(path, {
          value: `FIELD.${functionName}.${ot.data_path}`,
          label: path,
          type: ot.data_type,
        })
      })
    }

    this.coa.actionMap.set(functionName, {
      name: functionName,
      fields: _.cloneDeep(fields),
    })
    menuData.fields = fields

    this.menuData = [menuData]
  },
  // 复位属性
  clearConfig: function () {
    this.set({
      custom_code: '',
    })
    this.missing_assets = []
    this.missing_assets_data = []
    this.assets.reset()
  },
}))

export const ActionView = View.extend({
  initialize: function () {
    View.prototype.initialize.apply(this, arguments)

    this.listenTo(this.model, 'change:active', this.updateState)
    this.listenTo(this.model, 'change:action', this.truncateName)
    this.listenTo(this.model, 'change:show_number', this.truncateName)
  },
})
