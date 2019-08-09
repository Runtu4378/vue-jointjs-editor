/* eslint comma-dangle: ["error", "always-multiline"] */

import _backbone from 'backbone'
import _ from 'underscore'

import StartEnd from './startend'

const template = 'import phantom.rules as phantom\nimport json\nfrom datetime import datetime, timedelta\n\n'

export default _backbone.View.extend({
  initialize: function () {
    this.template = _.template(template)
    this.startend = new StartEnd()
    this.action = new n
    this.filter = new s
    this.decision = new o
    this.prompt = new a
    this.call_playbook = new r
    this.api = new l
    this.format = new c
    this.task = new h
    this.functionBlock = new u
  },
  render: function (t, e) {
    var i = {
      code: ' ',
      title: '',
    }
    if (t) {
      var n = t.get('type')
      if (n === 'coa.StartEnd') {
        i = this.startend.render(t, e)
      } else if (n === 'coa.Action') {
        i = this.action.render(t, e)
      } else if (n === 'coa.Filter') {
        i = this.filter.render(t, e)
      } else if (n === 'coa.Decision') {
        i = this.decision.render(t, e)
      } else if (n === 'coa.Prompt') {
        i = this.prompt.render(t, e)
      } else if (n === 'coa.CallPlaybook') {
        i = this.call_playbook.render(t, e)
      } else if (n === 'coa.API') {
        i = this.api.render(t, e)
      } else if (n === 'coa.Format') {
        i = this.format.render(t, e)
      } else if (n === 'coa.Task') {
        i = this.task.render(t, e)
      } else if (n === 'coa.FunctionBlock') {
        i = this.functionBlock.render(t, e)
      }
      if (i && i.code) {
        i.code = i.code.replace(/\n\s*\n\s*\n/g, '\n\n').replace(/^\s+|\s+$/g, '')
      }
    }
    return i
  },
  renderFullPlaybook: function (t) {
    var e = this
    var i = ''
    var n = ''
    var s = ''
    var o = 0
    var a = this.template()

    i += '"""\n'
    if (this.playbook.get('description') !== '') {
      i += this.playbook.get('description') + '\n'
    }
    i += '"""\n\n'
    o += this.playbook.get('description').split(/\r\n|\r|\n/).length + 3
    i += a
    o = i.split(/\r\n|\r|\n/).length
    this.coa.set('globalBlockStart', o)
    if (this.playbook.get('code_block') !== '') {
      var r = this.playbook.get('code_block')
      r = '##############################\n# Start - Global Code Block\n\n' + r + '\n\n# End - Global Code block\n##############################\n\n'
      i += r
      o += r.split(/\r\n|\r|\n/).length - 1
    }
    var l = this.blocks.findWhere({
      type: 'coa.StartEnd',
      title: 'START',
    })
    var c = this.blocks.findWhere({
      type: 'coa.StartEnd',
      title: 'END',
    })
    var h = this.render(l, !0)
    l.set('line_start', o)
    i += h.code + '\n'
    o += h.code.split(/\r\n|\r|\n/).length + 1
    l.set('line_end', o)
    _.each(this.blocks.models, function (i) {
      var s = i.get('type')
      if (s !== 'coa.StartEnd') {
        var a = e.render(i, 'block')
        var r = e.render(i, 'callback')
        var l = e.render(i, 'join')
        if (i.get('description') !== '') {
          var c = '\n"""\n' + i.get('description') + '\n"""'
          n += c
          o += c.split(/\r\n|\r|\n/).length - 1
        }
        i.set('line_start', o)
        n += '\n' + a.code + '\n'
        o += a.code.split(/\r\n|\r|\n/).length + 1
        if (r.code !== '') {
          i.set('callback_start', o)
          n += '\n' + r.code + '\n'
          o += r.code.split(/\r\n|\r|\n/).length + 1
        }
        if (l.code !== '') {
          i.set('join_start', o)
          n += '\n' + l.code + '\n'
          o += l.code.split(/\r\n|\r|\n/).length + 1
        }
        if (t) {
          if (!i.get('has_custom_block')) {
            i.set('block_code', a.code)
          }
          if (!i.get('has_custom_join')) {
            i.set('join_code', l.code)
          }
          if (!i.get('has_custom_callback')) {
            i.set('callback_code', r.code)
          }
        }
        i.set('line_end', o)
      }
    })
    var u = this.render(c, !0)
    var d = (i + n).split(/\r\n|\r|\n/).length + 1

    n += '\n' + u.code
    c.set('line_start', d)
    c.set('line_end', (i + n + s).split(/\r\n|\r|\n/).length)
    if (t) {
      if (!l.get('has_custom_block')) {
        l.set('block_code', h.code)
      }
      if (!c.get('has_custom_block')) {
        c.set('block_code', u.code)
      }
    }
    return i + n + s
  },
})
