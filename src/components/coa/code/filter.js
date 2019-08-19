/* eslint comma-dangle: ["error", "always-multiline"] */

import _ from 'underscore'

import Base from './base'

const template = "def <%= function_name %>(<%= args %>):\n    phantom.debug('<%= function_name %>() called')\n    <%= logic %>\n    return\n    \n"

export default Base.extend({
  initialize: function () {
    Base.prototype.initialize.apply(this)
    this.template = _.template(template)
  },
  generateLogic: function (t) {
    var e = this
    var i = '\n'
    var n = []
    var s = this.functionCallParams(t)
    _.keys(t.filter_params)
    i += '\n'
    _.each(t.outbound, function (t) {
      var e = t.port.substring(4)
      n[e] ? n[e].push(t.function_name) : n[e] = [t.function_name]
    })
    _.each(t.outputs.models, function (o, a) {
      let r = a + 1
      let l = ''
      let c = 'matched_artifacts_' + (a + 1) + ', matched_results_' + (a + 1)
      let h = false
      let u = false
      let d = false
      let p = '\n'
      let f = '\n'
      if (o.get('type') !== 'else') {
        l = o.conditions.length > 1
          ? o.get('logic')
          : ''
        p += e.indent(1) + "# collect filtered artifact ids for 'if' condition " + (a + 1) + '\n'
        p += e.indent(1) + c + ' = phantom.condition(\n'
        p += e.indent(2) + 'container=container,'
        f += e.indent(2) + 'conditions=[\n'
        _.each(o.conditions.models, function (t, i) {
          let n = t.get('param') || ''
          let s = t.get('comparison') || ''
          let o = t.get('value') || ''

          if (!(
            n.length > 1 &&
            n.charAt(0) === '[' &&
            n.charAt(n.length - 1) === ']'
          )) {
            n = n.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
          }
          if (!(
            o.length > 1 &&
            o.charAt(0) === '[' &&
            o.charAt(o.length - 1) === ']'
          )) {
            o = o.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
          }
          if (n !== '' || o !== '') {
            h = true
            if (_.startsWith(n, 'filtered-artifact:') || _.startsWith(o, 'filtered-artifact:')) {
              u = true
            }
            if (_.indexOf(n, ':filtered-action_result.') > 0 || _.indexOf(o, ':filtered-action_result.') > 0) {
              d = true
            }
            if (_.startsWith(n, 'current_date:now.')) {
              n = e.generateDateValue(n)
            } else if (_.startsWith(n, 'container:')) {
              n = e.generateContainerField(n, 'param')
            } else {
              if (!(
                n === 'True' || n === 'False' ||
                n.length > 1 && n.charAt(0) === '[' && n.charAt(n.length - 1) === ']' ||
                typeof n !== 'string' || n === 'None' || /^(-?)(0|[1-9]\d*\.?\d+|0?\.\d+)$/.test(n)
              )) {
                n = '"' + n + '"'
              }
            }

            if (_.startsWith(o, 'current_date:now.')) {
              o = e.generateDateValue(o)
            } else if (_.startsWith(o, 'container:')) {
              o = e.generateContainerField(o, 'value')
            } else {
              if (!(
                o === 'True' || o === 'False' ||
                o.length > 1 && o.charAt(0) === '[' && o.charAt(o.length - 1) === ']' ||
                typeof o !== 'string' || o === 'None' || /^(-?)(0|[1-9]\d*\.?\d+|0?\.\d+)$/.test(o))) {
                o = '"' + o + '"'
              }
            }

            f += e.indent(3) + '[' + n + ', "' + s + '", ' + o + '],\n'
          }
        })
        if (t.get('connection_type') === 'action') {
          p += '\n' + e.indent(2) + 'action_results=results,'
        }
        if (h) {
          i += p + f
          i += e.indent(2) + ']'
          if (l !== '') {
            i += ',\n' + e.indent(2) + "logical_operator='" + l + "'"
          }
          if (u) {
            i += ',\n' + e.indent(2) + 'filtered_artifacts=filtered_artifacts'
          }
          if (d) {
            i += ',\n' + e.indent(2) + 'filtered_results=filtered_results'
          }
          i += ',\n' + e.indent(2) + 'name="' + t.getFunctionName() + ':condition_' + (a + 1) + '"'
          i += ')\n\n'
          i += e.indent(1) + '# call connected blocks if filtered artifacts or results\n'
          i += e.indent(1) + 'if matched_artifacts_' + (a + 1) + ' or matched_results_' + (a + 1) + ':\n'
          if (void 0 !== n[r]) {
            var g = true
            _.each(n[r], function (t) {
              if (t !== '') {
                g = !1
                i += e.indent(2) + t + '(' + s + ', filtered_artifacts=matched_artifacts_' + (a + 1) + ', filtered_results=matched_results_' + (a + 1) + ')\n'
              }
            })
            g && (i += e.indent(2) + 'pass\n')
          } else {
            i += e.indent(2) + 'pass\n'
          }
        }
      } else {
        if (void 0 !== n[r]) {
          i += '\n' + e.indent(1) + "# 'else' condition, data pass through\n"
          _.each(n[r], function (t) {
            if (t !== '') {
              i += e.indent(1) + t + '(' + s + ')\n'
            }
          })
        }
      }
    })
    if (this.preamble !== '') {
      i = '\n' + this.preamble + '\n' + i
    }
    return i
  },
})
