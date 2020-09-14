/* eslint comma-dangle: ["error", "always-multiline"] */
/* eslint no-sequences: 0 */
/* eslint no-unused-expressions: 0 */
/* eslint no-return-assign: 0 */

import config from '../config'
import {
  Model,
  View,
} from './Base.js'

// import CollectionAssets from '../collections/asset_configs'
import CollectionOutputs from '../collections/Outputs'
import Output from '../models/Output' // s

// const itemWidth = config.gridSize * 9
// const itemHeight = config.gridSize * 5

export const FilterModel = Model.extend(_.extend({}, {
  markup: `<g class="rotatable">  
  <g class="inPorts"/><g class="outPorts"/>
  <g class="scalable"></g> 
  <rect class="background"></rect>
  <text class="number"/>
  <g class="icon"><image/></g>
  <g class="error"><image/></g>
  <g class="btn delete"><image/><title>Delete filter</title></g>
  </g>
  `,
  defaults: _.defaultsDeep({
    type: 'coa.Filter',
    state: 'filter',
    name: 'filter',
    size: {
      width: 82,
      height: 82,
    },
    inPorts: ['in'],
    outPorts: ['out-1'],
    attrs: {
      '.': {
        magnet: !1,
      },
      '.port-body': {
        r: 8,
        magnet: !0,
      },
      '.background': {
        'fill-opacity': 1,
        'stroke-width': 2,
        width: 60,
        height: 60,
        y: 10,
        x: -14,
        rx: 5,
        ry: 5,
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
      'g.error image': {
        'xlink:href': '',
        x: 58,
        y: 31,
        width: 16,
        height: 13,
      },
      'text.number': {
        'font-size': 11,
        'font-family': 'Roboto',
        'font-weight': 600,
        text: '',
        'ref-y': 58,
        'ref-x': 42,
        'text-anchor': 'middle',
      },
      'g.icon image': {
        'xlink:href': `${config.staticPrefix}/block_icon_filter.svg`,
        y: 30,
        x: 32,
        width: 21,
        height: 21,
      },
      'g.delete image': {
        'xlink:href': `${config.staticPrefix}/block_delete.svg`,
        x: 50,
        y: 0,
        width: 26,
        height: 26,
        opacity: 0.8,
      },
      '.port-body circle': {
        magnet: !0,
      },
      '.inPorts circle': {
        type: 'input',
        'ref-x': 0,
        'ref-y': 39,
      },
      '.outPorts circle': {
        type: 'output',
      },
    },
    // 存放选择的数据
    paramMenu: {},
    valueMenu: {},
    compMenu: {},
    logicMenu: {},
  }, Model.prototype.defaults),
  initialize: function () {
    Model.prototype.initialize.apply(this, arguments)
    this.outputs = new CollectionOutputs([new Output()])
    this.on('change:number', function (t, e) {
      t.attr('.number/text', e)
    })
    this.on('change:custom_code', function (t, e) {
      this.set('warn', false)
    })
    this.on('change:active', function (t, e) {
      e ? this.set('status', 'active') : this.errors > 0 ? this.set('status', 'error') : this.warnings.length > 0 ? this.set('status', 'warn') : this.set('status', '')
    })
    this.on('change:status', function (t, e) {
      var i = this.coaSettings.getBlockBorderColor()
      var n = this.errors > 0
      var s = this.warnings.length > 0
      e === 'active' ? i = this.coaSettings.strokeColors[e] : n ? (
        i = this.coaSettings.strokeColors.error, e = 'error'
      ) : s && (i = this.coaSettings.strokeColors.warn, e = 'warn'), e === 'warn' || e === 'error' ? (t.attr('g.error/opacity', 1), t.attr({
        'g.error image': {
          'xlink:href': `${config.staticPrefix}/block_icon_warn.svg`,
        },
      })) : t.attr('g.error/opacity', 0), t.attr('.background/stroke', i)
    })
    this.set('name', 'filter')
    this.listenTo(this.outputs, 'change', this.generateMenuData)
    this.attr('.background/transform', 'rotate(45 30 70)')
    this.attr('.background/fill', this.coaSettings.getBlockBackgroundColor())
    this.attr('.background/stroke', this.coaSettings.getBlockBorderColor())
  },
  addOutput: function (t, e) {
    var i = this.get('outPorts')
    this.set('outPorts', i.concat(['out-' + (i.length + 1)]), e)
    var n = this.get('hasElse')
      ? this.outputs.length - 1
      : this.outputs.length

    if (t === 'else') {
      this.outputs.add(new Output({
        type: t,
        display: 'Else',
      }))
    } else {
      this.outputs.add(new Output({
        type: t,
        display: 'If',
      }), {
        at: n,
      })
    }

    this.updateDeletePosition()
    this.dispatcher.trigger('update:code')
    this.markCodeChange()
  },
  removeOutput: function (t, e, i) {
    var n = this.graph.getConnectedLinks(this, {
      outbound: !0,
    })

    _.each(n, function (t) {
      var i = t.get('source')
      var n = i.port.substring(4)
      if (n > e) {
        i.port = 'out-' + (n - 1)
        i.selector = 'g:nth-child(1) > g:nth-child(2) > g:nth-child(' + (e - 1) + ') > circle:nth-child(1)'
        t.set('source', i)
      } else if (n === e) {
        t.remove()
      }
    })

    this.get('outPorts').splice(-1)
    this.updateDeletePosition()
    this.outputs.remove(t)
    this.trigger('change:outPorts')
    this.dispatcher.trigger('block:update', this)
    this.dispatcher.trigger('update:code')
    this.markCodeChange()
  },
  getPortAttrs: function (t, e, i, n, s) {
    var o = {}
    var a = 'port-' + e
    var r = n + '>.' + a
    var l = r + '>.port-body'
    if (o[l] = {
      port: {
        id: t,
        type: s,
      },
    }, s === 'out') {
      switch (e) {
        case 0:
          o[r] = {
            port: {
              id: t,
              type: s,
            },
            'ref-x': 83,
            'ref-y': 40,
          }
          break
        case 1:
          o[r] = {
            port: {
              id: t,
              type: s,
            },
            'ref-x': 41,
            'ref-y': 82,
          }
          break
        case 2:
          o[r] = {
            port: {
              id: t,
              type: s,
            },
            'ref-x': 41,
            'ref-y': -2,
          }
          break
        case 3:
          o[r] = {
            port: {
              id: t,
              type: s,
            },
            'ref-x': 67,
            'ref-y': 16,
          }
          break
        case 4:
          o[r] = {
            port: {
              id: t,
              type: s,
            },
            'ref-x': 67,
            'ref-y': 63,
          }
      }
    }
    return o
  },
  generateMenuData: function () {
    var t = this
    var e = this.getFunctionName()
    var i = /artifact:\*\./
    this.menuData = []
    this.outputs && _.each(this.outputs.models, function (n, s) {
      var o = {
        name: e + ' condition_' + (s + 1),
        key: e + ':condition_' + (s + 1) + ':artifact',
        fields: {},
      }
      var a = []
      var r = []
      var l = false

      _.each(n.conditions.models, function (t) {
        var e = t.get('param')
        var n = t.get('value')

        if (e.indexOf(':action_result.') !== -1) {
          var s = e.substring(0, e.indexOf(':action_result.'))
          _.startsWith(s, 'filtered-data:') && (s = s.substring(s.lastIndexOf(':') + 1)), a.push(s)
        }
        if (n.indexOf(':action_result.') !== -1) {
          var s1 = n.substring(0, n.indexOf(':action_result.'))
          _.startsWith(s1, 'filtered-data:') && (s1 = s1.substring(s1.lastIndexOf(':') + 1)), a.push(s1)
        } (l || n.match(i) || e.match(i)) && (l = !0)
      })

      a = _.unique(a)
      var c = 'filtered-data:' + e + ':condition_' + (s + 1) + ':'

      if (l) {
        o.name += ' filtered artifacts'
        o.fields['_MENU_GROUP_artifact:*.cef'] = {}
        _.each(_.keys(this.cefs.values), function (e) {
          o.fields[c + e] = t.cefs.values[e]
        })

        o.fields['_MENU_GROUP_artifact headers'] = {}
        _.each(_.keys(t.artifact_data), function (e) {
          o.fields[c + e] = t.artifact_data[e]
        })

        r.push(o)
      }
      a.length > 0 && _.each(a, function (i) {
        var n = {
          name: e + ' condition_' + (s + 1) + ' ' + i + ' filtered results',
          key: e + ':condition_' + (s + 1) + ':' + i + ':action_result',
          fields: {},
        }
        if (t.coa.action_keys.hasOwnProperty(i)) {
          var o = t.coa.action_keys[i].fields
          _.each(_.keys(o), function (t) {
            var e = t.indexOf(':action_result')
            var i = c + t.substring(0, e) + ':' + t.substring(e + 1)
            n.fields[i] = _.assign({}, o[t])
          })

          n.fields = _.extend({
            '_MENU_GROUP_action results': 'action results',
          }, n.fields)
        }
        r.push(n)
      })

      t.menuData.push(r)
    })
  },
  getMenuData: function (t, e) {
    var i = this
    var n = []
    var s = []
    var o = this.graph.getConnectedLinks(this, {
      outbound: true,
    })
    _.each(o, function (i) {
      var n = i.getTargetElement()
      var o = i.get('source')
      var a = o.port.substring(4)
      n && (n.id === t.id || e.isSuccessor(n, t)) && s.push(a - 1), s = _.unique(s)
    })
    _.each(s, function (t) {
      n = n.concat(i.menuData[t])
    })

    return n
  },
  renamePatterns: function (t) {
    var e = '^(filtered-data:)(' + t + ')(:condition_[0-9]+:[a-zA-Z0-9_]+:)'
    return [RegExp(e)]
  },
  updateParamNames: function (t, e) {
    _.each(this.outputs.models, function (i, n) {
      _.each(i.conditions.models, function (i, n) {
        var s = i.get('value')
        var o = i.get('param')
        _.each(t, function (t) {
          return s.match(t) ? (s = s.replace(t, '$1' + e + '$3'), i.set('value', s), false) : void 0
        }), _.each(t, function (t) {
          return o.match(t) ? (o = o.replace(t, '$1' + e + '$3'), i.set('param', o), false) : void 0
        })
      })
    })
  },
  updatePromptParamValues: function (t) {
    _.each(this.outputs.models, function (e, i) {
      _.each(e.conditions.models, function (e, i) {
        var n = e.get('param')
        var s = t + ':action_result.summary.response'
        if (n === s) {
          var o = s.replace('response', 'responses.0')
          e.set('param', o)
        }
      })
    })
  },
  updateOutputVarNames: function (t, e) {
    _.each(this.outputs.models, function (i, n) {
      _.each(i.conditions.models, function (i, n) {
        var s = i.get('value')
        var o = i.get('param')
        _.each(t, function (t) {
          return s.match(t) ? (s = s.replace(t, '$1$2' + e), i.set('value', s), false) : void 0
        }), _.each(t, function (t) {
          return o.match(t) ? (o = o.replace(t, '$1$2' + e), i.set('param', o), false) : void 0
        })
      })
    })
  },
  validateConfig: function (t, e, i, n) {
    var s = this
    _.each(this.outputs.models, function (t, o) {
      _.each(t.conditions.models, function (t, a) {
        var r = t.get('value')
        var l = t.get('param')
        r && !s._checkConfigValue(r, e, i, n) && (s.warnings.push('Invalid data path on condition ' + (o + 1)), 
        s.field_warnings.push(r)), 
        l && !s._checkConfigValue(l, e, i, n) && (s.warnings.push('Invalid data path on condition ' + (o + 1)), 
        s.field_warnings.push(l)), r === '' && l === '' && s.warnings.push('No parameters configured on condition ' + (o + 1))
      })
    })
  },
  updateDeletePosition: function () {
    var t = this.get('outPorts').length < 4 ? 50 : 5
    this.attr({
      'g.delete image': {
        x: t,
      },
    })
  },
  toJSON: function () {
    var t = FilterModel.__super__.toJSON.apply(this)
    return t.outputs = this.outputs.toJSON(), t
  },
  conversion35: function () {
    this.attr({
      'g.icon image': {
        'xlink:href': `${config.staticPrefix}/block_icon_filter.svg`,
        x: 32,
        y: 30,
        width: 21,
        height: 21,
      },
    })
  },
}))

export const FilterView = View.extend({
  initialize: function () {
    View.prototype.initialize.apply(this, arguments)
  },
  render: function () {
    View.prototype.render.call(this, arguments)
    // console.log(this.model.get('type'))
    // this.$el.addClass(this.model.get('title').toLowerCase())
  },
})
