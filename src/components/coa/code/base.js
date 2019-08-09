/* eslint comma-dangle: ["error", "always-multiline"] */

import _backbone from 'backbone'
import _ from 'underscore'

const actionTemplate = '<%= action %>(<%= params %>)\n'
const callbackTemplate = "def <%= fname %>(<%= args %>):\n    phantom.debug('<%= fname %>() called')\n    <%= actions %>\n    return\n"
const joinTemplate = "def join_<%= function_name %>(<%= args %>):\n    phantom.debug('join_<%= function_name %>() called')\n    <% if (has_optionals) { %>\n    # if the joined function has already been called, do nothing\n    if phantom.get_run_data(key='join_<%= function_name %>_called'):\n        return\n    <% } %>\n    <% if (completed.playbooks) {%>\n    # check if all connected incoming playbooks or actions are done i.e. have succeeded or failed\n    if phantom.completed(playbook_names=[<%= completed.playbooks %>]<% if (completed.actions) { %>, action_names=[<%= completed.actions %>]<%}%>):\n        <% if (has_optionals) { %>\n        # save the state that the joined function has now been called\n        phantom.save_run_data(key='join_<%= function_name %>_called', value='<%= function_name %>')\n        <% } %>\n        # call connected block \"<%= function_name %>\"\n        <%= function_name %>(container=container, handle=handle)\n    <% } else if (required) { %>\n    # check if all connected incoming actions are done i.e. have succeeded or failed\n    if phantom.actions_done([ <%= required %> ]):\n        <% if (has_optionals) { %>\n        # save the state that the joined function has now been called\n        phantom.save_run_data(key='join_<%= function_name %>_called', value='<%= function_name %>')\n        <% } %>\n        # call connected block \"<%= function_name %>\"\n        <%= function_name %>(container=container, handle=handle)\n    <% } else { %>\n    # no callbacks to check, call connected block \"<%= function_name %>\"\n    phantom.save_run_data(key='join_<%= function_name %>_called', value='<%= function_name %>', auto=True)\n\n    <%= function_name %>(container=container, handle=handle)\n    <% } %>\n    return\n"

export default _backbone.View.extend({
  initialize: function () {
    this.indentWidth = '    '
    this.actionTemplate = _.template(actionTemplate)
    this.callbackTemplate = _.template(callbackTemplate)
    this.joinTemplate = _.template(joinTemplate)
  },
  render: function (t, e) {
    if (e === 'block') {
      return t.get('has_custom_block')
        ? {
          title: t.getFunctionName(),
          code: t.get('custom_code'),
        }
        : this.blockFunction(t)
    }
    if (e === 'callback') {
      const i = {
        title: t.getFunctionName() + '_callback',
        code: '',
      }
      if (t.get('has_custom_callback')) {
        i.code = t.get('custom_callback')
      } else if (t.get('callsback') && t.outbound.length > 1) {
        i.code = this.callbackFunction(t)
      }
      return i
    }
    if (e === 'join') {
      const i = {
        title: 'join_' + t.getFunctionName(),
        code: '',
      }
      if (t.get('has_custom_join')) {
        i.code = t.get('custom_join')
      } else if (t.inCount > 1) {
        i.code = this.joinFunction(t)
      }
      return i
    }
  },
  generateContainerCode: function (t, e) {
    var i = t.substring('container:'.length)
    var n = i + '_' + e
    return {
      name: n,
      code: n + " = container.get('" + i + "', None)\n",
    }
  },
  generateCollectCode: function (t, e) {
    var i = this
    var n = ''
    var s = 0
    var o = 0
    var a = 0
    var r = 0
    var l = 0
    var c = 0
    var h = 0
    var u = 0
    var d = 0
    var p = []
    var f = []
    var g = {}
    var m = {}
    var v = {}
    var b = {}
    var y = {}
    var w = {}
    var x = []
    var C = []
    var k = []
    var I = []
    var A = []
    var M = []
    var S = {}
    var T = {}
    var N = {}
    var D = {}
    _.each(_.keys(e), function (t, P) {
      var z = e[t]
      if (typeof z !== 'string') {
        z = z.toString()
      }
      z = z.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
      if (z.match(/^artifact:\*/)) {
        let L = 'container_item_'
        let O = f.indexOf(z)
        if (O === -1) {
          L += s
          s += 1
          f.push(z)
        } else {
          L += O
        }
        D[t] = L
      } else if (z.match(/^filtered-data:.*:artifact:\*/)) {
        const E = z.indexOf(':artifact:')
        const B = z.substring(0, E)
        let L = ''
        if (g.hasOwnProperty(B)) {
          L = 'filtered_artifacts_item_' + a + '_'
          if (_.includes(g[B], z)) {
            let O = g[B].indexOf(z)
            L += O
          } else {
            g[B].push(z)
            L += g[B].length - 1
          }
        } else {
          g[B] = [z]
          a += 1
          L = 'filtered_artifacts_item_' + a + '_0'
          I.push(B)
        }
        D[t] = L
      } else if (z.match(/^filtered-data:.*:action_result./)) {
        const E = z.indexOf(':action_result.')
        const j = z.substring(0, E)
        let L = ''
        if (b.hasOwnProperty(j)) {
          L = 'filtered_results_item_' + T[j] + '_'
          if (_.includes(b[j], z)) {
            var O = b[j].indexOf(z)
            L += O
          } else {
            b[j].push(z)
            L += b[j].length - 1
          }
        } else {
          b[j] = [z]
          c += 1
          T[j] = c
          L = 'filtered_results_item_' + c + '_0'
          k.push(j)
        }
        D[t] = L
      } else if (z.match(/^[A-Za-z0-9_]*:artifact:\*\./)) {
        const E = z.indexOf(':artifact')
        const j = z.substring(0, E)
        let L = ''
        if (v.hasOwnProperty(j)) {
          L = 'inputs_item_' + N[j] + '_'
          if (_.includes(v[j], z)) {
            const O = v[j].indexOf(z)
            L += O
          } else {
            v[j].push(z)
            L += v[j].length - 1
          }
        } else {
          v[j] = [z]
          l += 1
          N[j] = l
          L = 'inputs_item_' + l + '_0'
          C.push(j)
        }
        D[t] = L
      } else if (z.indexOf(':action_result.') > 0 || z.indexOf(':summary.') > 0) {
        var E = z.indexOf(':action_result.')
        var j = z.substring(0, E)
        var L = 'results_item_'
        if (m.hasOwnProperty(j)) {
          L += S[j] + '_'
          if (_.includes(m[j], z)) {
            const O = m[j].indexOf(z)
            L += O
          } else {
            m[j].push(z)
            L += m[j].length - 1
          }
        } else {
          m[j] = [z]
          r += 1
          S[j] = r
          L += r + '_0'
          x.push(j)
        }
        D[t] = L
      } else if (z.match(/^[A-Za-z0-9_]*:formatted_data/)) {
        const E = z.indexOf(':formatted_data')
        let R = z.substring(0, E)
        if (z.endsWith('.*')) {
          R += '__as_list'
        }
        let L = 'formatted_data_'
        if (w.hasOwnProperty(R)) {
          L += w[R]
        } else {
          u += 1
          w[R] = u
          M.push(R)
          L += u
        }
        D[t] = L
      } else if (z.match(/^[A-Za-z0-9_]*:custom_function/)) {
        let G = z.split(':')[0] + '__' + z.split(':')[2]
        let V = z.split(':')[0]
        let W = z.split(':')[2]
        n += '\n' + i.indent(1) + G + " = json.loads(phantom.get_run_data(key='" + V + ':' + W + "'))"
        D[t] = G
      } else if (_.startsWith(z, 'container:')) {
        let F = i.generateContainerCode(z, 'value')
        n += '\n' + i.indent(1) + F.code
        D[t] = F.name
      } else if (z.match(/^filtered-artifact:\*\.cef/)) {
        let L = 'passed_filtered_artifact_item_'
        let O = p.indexOf(z)
        if (O === -1) {
          L += o
          o += 1
          p.push(z)
        } else {
          L += O
        }
        D[t] = L
      } else if (z.indexOf(':filtered-action_result.') > 0) {
        let E = z.indexOf(':filtered-action_result.')
        let j = z.substring(0, E)
        let L = ''
        if (y.hasOwnProperty(j)) {
          L = 'passed_filtered_results_item_' + h + '_'
          if (_.includes(y[j], z)) {
            let O = y[j].indexOf(z)
            L += O
          } else {
            y[j].push(z)
            L += y[j].length - 1
          }
        } else {
          y[j] = [z]
          h += 1
          L = 'passed_filtered_results_item_' + h + '_0'
          A.push(j)
        }
        D[t] = L
      } else {
        let $ = i.getCodeForUnknownDataPath(t, z, D, n, d)
        D = $.keyed_data
        n = $.collect_code
        d += 1
      }
    })
    var P = '[' + _.map(f, function (t) {
      return "'" + t + "'"
    }).join(', ') + ", 'artifact:*.id']"
    var z = '[' + _.map(p, function (t) {
      return "'" + t + "'"
    }).join(', ') + ", 'filtered-artifact:*.id']"
    if (s > 0) {
      n += '\n' + this.indent(1) + 'container_data = phantom.collect2(container=container, '
      n += 'datapath=' + P + ')'
    }
    if (o > 0) {
      n += '\n' + this.indent(1) + 'passed_filtered_artifact_data = phantom.collect2(container=container, '
      n += 'datapath=' + z + ', filter_artifacts=filtered_artifacts)'
    }
    _.each(x, function (t, e) {
      let s = _.map(m[t], function (t) {
        return "'" + t + "'"
      })
      let o = '[' + s.join(', ') + ']'
      n += '\n' + i.indent(1) + 'results_data_' + (e + 1) + ' = phantom.collect2(container=container, datapath=' + o + ', action_results=results)'
    })
    _.each(C, function (t, e) {
      let s = _.map(v[t], function (t) {
        return "'" + t + "'"
      })
      let o = '[' + s.join(', ') + ']'
      n += '\n' + i.indent(1) + 'inputs_data_' + (e + 1) + ' = phantom.collect2(container=container, datapath=' + o + ', action_results=results)'
    })
    _.each(I, function (t, e) {
      let s = _.map(g[t], function (t) {
        return "'" + t + "'"
      })
      let o = '[' + s.join(', ') + ']'
      n += '\n' + i.indent(1) + 'filtered_artifacts_data_' + (e + 1) + ' = phantom.collect2(container=container, datapath=' + o + ')'
    })
    _.each(k, function (t, e) {
      var s = _.map(b[t], function (t) {
        return '"' + t + '"'
      })
      var o = '[' + s.join(', ') + ']'
      n += '\n' + i.indent(1) + 'filtered_results_data_' + (e + 1) + ' = phantom.collect2(container=container, datapath=' + o + ')'
    })
    _.each(A, function (t, e) {
      var s = _.map(y[t], function (t) {
        return '"' + t + '"'
      })
      var o = '[' + s.join(', ') + ']'
      n += '\n' + i.indent(1) + 'passed_filtered_results_data_' + (e + 1) + ' = phantom.collect2(container=container, datapath=' + o + ', action_results=filtered_results)'
    })
    _.each(M, function (t, e) {
      n += '\n' + i.indent(1) + 'formatted_data_' + (e + 1) + " = phantom.get_format_data(name='" + t + "')"
    })
    var L = 1
    n += '\n\n'
    _.each(f, function (t, e) {
      n += i.indent(L) + 'container_item_' + e + ' = [item[' + e + '] for item in container_data]\n'
    })
    _.each(p, function (t, e) {
      n += i.indent(L) + 'passed_filtered_artifact_item_' + e + ' = [item[' + e + '] for item in passed_filtered_artifact_data]\n'
    })
    _.each(I, function (t, e) {
      _.each(g[t], function (t, s) {
        n += i.indent(L) + 'filtered_artifacts_item_' + (e + 1) + '_' + s + ' = [item[' + s + '] for item in filtered_artifacts_data_' + (e + 1) + ']\n'
      })
    })
    _.each(x, function (t, e) {
      _.each(m[t], function (t, s) {
        n += i.indent(L) + 'results_item_' + (e + 1) + '_' + s + ' = [item[' + s + '] for item in results_data_' + (e + 1) + ']\n'
      })
    })
    _.each(C, function (t, e) {
      _.each(v[t], function (t, s) {
        n += i.indent(L) + 'inputs_item_' + (e + 1) + '_' + s + ' = [item[' + s + '] for item in inputs_data_' + (e + 1) + ']\n'
      })
    })
    _.each(k, function (t, e) {
      _.each(b[t], function (t, s) {
        n += i.indent(L) + 'filtered_results_item_' + (e + 1) + '_' + s + ' = [item[' + s + '] for item in filtered_results_data_' + (e + 1) + ']\n'
      })
    })
    _.each(A, function (t, e) {
      _.each(y[t], function (t, s) {
        n += i.indent(L) + 'passed_filtered_results_item_' + (e + 1) + '_' + s + ' = [item[' + s + '] for item in passed_filtered_results_data_' + (e + 1) + ']\n'
      })
    })
    n += '\n'
    return {
      code: n,
      data: D,
    }
  },
  blockFunction: function (t) {
    return {
      title: t.getFunctionName(),
      code: '',
    }
  },
  getCodeForUnknownDataPath: function (t, e, i, n, s) {
    e === 'True' || e === 'False' ? i[t] = e : e.length > 1 && e.charAt(0) === '[' && e.charAt(e.length - 1) === ']' ? i[t] = e : i[t] = '"' + e + '"'
    return {
      keyed_data: i,
      collect_code: n,
    }
  },
  callbackFunction: function (t) {
    var e = this
    var i = '\n'
    _.each(t.outbound, function (n) {
      n.function_name !== '' && (i += e.indent(1) + e.actionTemplate({
        action: n.function_name,
        params: e.callbackParams(t),
      }))
    })
    return this.callbackTemplate({
      fname: this.generateCallbackName(t),
      args: this.functionSignature(),
      actions: i,
    })
  },
  joinFunction: function (t) {
    let e = t.getFunctionName()
    let i = _.filter(t.inbound, function (t) {
      return t !== e
    })
    let n = t.get('join_optional')
    let s = n.length === 0 ? !1 : !0
    i = _.difference(i, n)
    let o = i.length > 0
      ? "'" + _.uniq(i).join("', '") + "'"
      : ''
    let a = this.blocks.filter(function (t) {
      return t.get('type') === 'coa.CallPlaybook' && i.indexOf(t.getFunctionName()) > -1
    }).map(function (t) {
      return t.getFunctionName()
    })
    let r = _.difference(i, a)
    let l = {
      playbooks: a.length > 0 ? "'" + _.uniq(a).join("', '") + "'" : '',
      actions: r.length > 0 ? "'" + _.uniq(r).join("', '") + "'" : '',
    }
    return this.joinTemplate({
      function_name: e,
      args: this.functionSignature(),
      required: o,
      has_optionals: s,
      completed: l,
    })
  },
  indent: function (t) {
    (typeof t === 'undefined' || typeof t !== 'number' || t < 1) && (t = 1)
    return _.repeat(this.indentWidth, t)
  },
  functionSignature: function () {
    return 'action=None, success=None, container=None, results=None, handle=None, filtered_artifacts=None, filtered_results=None'
  },
  functionCallParams: function (t) {
    return t.get('connection_type') === 'object'
      ? 'container=container'
      : 'action=action, success=success, container=container, results=results, handle=handle'
  },
  callbackParams: function () {
    return 'action=action, success=success, container=container, results=results, handle=handle'
  },
  generateCallbackName: function (t) {
    var e = t.outbound
    return e.length > 1 ? t.getFunctionName() + '_callback' : e[0] ? e[0].function_name : ''
  },
})
