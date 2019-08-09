/* eslint comma-dangle: ["error", "always-multiline"] */

import _ from 'underscore'

import Base from './base'

const template = "def <%= function_name %>(<%= args %>):\n    phantom.debug('<%= function_name %>() called')\n    <% if (from_callback) { %>\n    #phantom.debug('Action: {0} {1}'.format(action['name'], ('SUCCEEDED' if success else 'FAILED')))<% } %>\n    <%= collect_statements %>\n    parameters = []\n    <%= param_loop %>\n    phantom.act(\"<%= action_call %>\", parameters=parameters<% if (app) { %>, app={ \"name\": '<%= app %>' }<% } %><% if (assets) { %>, assets=[<%= assets %>]<% } %><% if (callback) { %>, callback=<%= callback %><% } %><% if (reviewer) { %>, reviewer=\"<%= reviewer %>\"<% } %><% if (delay > 0) { %>, start_time=start_time<% } %><% if (custom_name) { %>, name=\"<%= custom_name %>\"<% } %><% if (parent_action) { %>, parent_action=action<% } %>)\n\n    return\n"

export default Base.extend({
  initialize: function () {
    Base.prototype.initialize.apply(this)
    this.template = _.template(template)
  },
  blockFunction: function (t) {
    var e = t.get('action')
    var i = t.get('state')
    var n = t.getFunctionName()
    var s = '<undefined>'
    var o = this.generateCollect(t)
    var a = 0
    var r = []
    e && (s = e)
    _.each(t.assets.models, function (t) {
      t.get('fields') && (a += Object.keys(t.get('fields')).length)
      t.get('config_type') === 'asset' && r.push(t.get('name'))
    })
    var l = {
      function_name: n,
      args: this.functionSignature(),
      action_call: s,
      from_callback: t.get('connection_type') === 'action' ? !0 : !1,
      assets: _.map(r, function (t) {
        return "'" + t + "'"
      }),
      collect_statements: o.collect,
      callback: this.generateCallbackName(t),
      param_loop: o.loop,
      custom_name: n,
      param_check: a === 0 && t.assets.length > 0 ? !1 : !0,
      reviewer: t.get('reviewer'),
      parent_action: t.parent_action,
      app: i === 'app_action_config' || i === 'action_app_config' ? t.get('app') : '',
    }
    l.assets.length === 0 && (l.assets = '')
    var c = this.template(_.extend(t.toJSON(), l))
    var h = (this.functionSignature(), {
      title: n,
      code: c,
    })
    return h
  },
  generateCollect: function (t) {
    let e = this
    let i = {}
    let n = []
    let s = ''
    let o = ''
    let a = 0
    let r = 0
    let l = 0
    let c = 0
    let h = 0
    let u = 0
    let d = 0
    let p = 0
    let f = ''
    let g = []
    let m = []
    let v = {}
    let b = {}
    let y = {}
    let w = {}
    let x = {}
    let C = {}
    let k = []
    let I = []
    let A = []
    let M = []
    let S = []
    let T = []
    let N = []
    let D = ''
    let P = t.get('required_params')
    _.each(t.assets.models, function (t) {
      var e = t.get('fields')
      e && _.each(_.keys(e), function (t) {
        i[t] = e[t]
      })
    })
    _.each(_.keys(i), function (t, o) {
      var f = i[t]
      if (typeof f !== 'string') {
        f = f.toString()
      }
      f = f.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
      if (f.match(/^artifact:\*/)) {
        let z = 'container_item['
        let L = m.indexOf(f)
        if (L === -1) {
          z += a + ']'
          a += 1
          m.push(f)
        } else {
          z += L + ']'
        }
        n.push(z)
        P.hasOwnProperty(t) && N.push(z)
        D === '' && (D = 'container')
      } else if (f.match(/^filtered-data:.*:artifact:\*/)) {
        let O = f.indexOf(':artifact:')
        let E = f.substring(0, O)
        let z = ''
        if (v.hasOwnProperty(E)) {
          z = 'filtered_artifacts_item_' + l + '['
          if (_.includes(v[E], f)) {
            var L = v[E].indexOf(f)
            z += L + ']'
          } else {
            v[E].push(f)
            z += v[E].length - 1 + ']'
          }
          n.push(z)
        } else {
          v[E] = [f]
          l += 1
          z = 'filtered_artifacts_item_' + l + '[0]'
          n.push(z)
          M.push(E)
        }
        P.hasOwnProperty(t) && N.push(z)
        D === '' && (D = 'filtered-artifacts')
      } else if (f.match(/^filtered-data:.*:action_result./)) {
        let O = f.indexOf(':action_result.')
        let B = f.substring(0, O)
        let z = ''
        if (w.hasOwnProperty(B)) {
          z = 'filtered_results_item_' + u + '['
          if (_.includes(w[B], f)) {
            let L = w[B].indexOf(f)
            z += L + ']'
          } else {
            w[B].push(f)
            z += w[B].length - 1 + ']'
          }
          n.push(z)
        } else {
          w[B] = [f]
          u += 1
          z = 'filtered_results_item_' + u + '[0]'
          n.push(z)
          A.push(B)
        }
        P.hasOwnProperty(t) && N.push(z)
        D === '' && (D = 'filtered')
      } else if (f.match(/^[A-Za-z0-9_]*:artifact:\*\./)) {
        let O = f.indexOf(':artifact')
        let B = f.substring(0, O)
        let z = ''
        if (y.hasOwnProperty(B)) {
          z = 'inputs_item_' + h + '['
          if (_.includes(y[B], f)) {
            let L = y[B].indexOf(f)
            z += L + ']'
          } else {
            y[B].push(f)
            z += y[B].length - 1 + ']'
          }
          n.push(z)
        } else {
          y[B] = [f]
          h += 1
          z = 'inputs_item_' + h + '[0]'
          n.push(z)
          I.push(B)
        }
        P.hasOwnProperty(t) && N.push(z)
        D === '' && (D = 'inputs')
      } else if (f.indexOf(':action_result.') > 0 || f.indexOf(':summary.') > 0) {
        let O = f.indexOf(':action_result.')
        let B = f.substring(0, O)
        if (b.hasOwnProperty(B)) {
          let z = 'results_item_' + c + '['
          if (_.includes(b[B], f)) {
            let L = b[B].indexOf(f)
            z += L + ']'
          } else {
            b[B].push(f)
            z += b[B].length - 1 + ']'
          }
          n.push(z)
          P.hasOwnProperty(t) && N.push(z)
        } else {
          b[B] = [f]
          c += 1
          let z = 'results_item_' + c + '[0]'
          n.push(z)
          k.push(B)
          P.hasOwnProperty(t) && N.push(z)
        }
        D === '' && (D = 'results')
      } else if (f.match(/^[A-Za-z0-9_]*:formatted_data/)) {
        let j = !1
        let O = f.indexOf(':formatted_data')
        let R = f.substring(0, O)
        if (f.endsWith('.*')) {
          j = !0
          R += '__as_list'
        }
        if (C.hasOwnProperty(R)) {
          var z
          z = j
            ? 'formatted_part_' + C[R].idx
            : 'formatted_data_' + C[R].idx
          n.push(z)
        } else {
          p += 1
          C[R] = {
            idx: p,
            is_list: j,
          }
          T.push(R)
          let z
          z = j
            ? 'formatted_part_' + p
            : 'formatted_data_' + p
          n.push(z)
        }
      } else if (_.startsWith(f, 'container:')) {
        var G = e.generateContainerCode(f, 'value')
        s += '\n' + e.indent(1) + G.code
        n.push(G.name)
      } else if (f.match(/^[A-Za-z0-9_]*:custom_function/)) {
        var V = f.split(':')[0]
        var W = f.split(':')[2]
        var F = V + '__' + W
        var $ = V + ':' + W
        s += '\n' + e.indent(1) + F + " = json.loads(phantom.get_run_data(key='" + $ + "'))"
        n.push(F)
      } else if (f.match(/^filtered-artifact:\*\.cef/)) {
        let z = 'passed_filtered_artifact_item['
        let L = g.indexOf(f)
        if (L === -1) {
          z += r + ']'
          r += 1
          g.push(f)
        } else {
          z += L + ']'
        }
        n.push(z)
        D === '' && (D = 'filtered-container')
      } else if (f.indexOf(':filtered-action_result.') > 0) {
        let O = f.indexOf(':filtered-action_result.')
        let B = f.substring(0, O)
        let z = ''
        if (x.hasOwnProperty(B)) {
          z = 'passed_filtered_results_item_' + d + '['
          if (_.includes(x[B], f)) {
            let L = x[B].indexOf(f)
            z += L + ']'
          } else {
            x[B].push(f)
            z += x[B].length - 1 + ']'
          }
          n.push(z)
        } else {
          x[B] = [f]
          d += 1
          z = 'passed_filtered_results_item_' + d + '[0]'
          n.push(z)
          S.push(B)
        }
        P.hasOwnProperty(t) && N.push(z)
        D === '' && (D = 'legacy-filtered')
      } else {
        f === 'True' || f === 'False' ? n.push(f) : f.length > 1 && f.charAt(0) === '[' && f.charAt(f.length - 1) === ']' ? n.push(f) : /^(-?)(0|[1-9]\d*\.?\d+|0?\.\d+)$/.test(f) ? n.push(f) : n.push('"' + f + '"')
      }
    })
    let z = '[' + _.map(m, function (t) {
      return "'" + t + "'"
    }).join(', ') + ", 'artifact:*.id']"
    let L = '[' + _.map(g, function (t) {
      return "'" + t + "'"
    }).join(', ') + ", 'filtered-artifact:*.id']"
    if (n.length > 0) {
      s += '\n' + this.indent(1) + "# collect data for '" + t.getFunctionName() + "' call"
    }
    if (a > 0) {
      s += '\n' + this.indent(1) + 'container_data = phantom.collect2(container=container, '
      s += 'datapath=' + z + ')'
      D === 'container' && f === '' && (f = 'container_item[' + a + ']')
    }
    a > 0 && (s += "\n" + this.indent(1) + "container_data = phantom.collect2(container=container, ", s += "datapath=" + z + ")", "container" === D && "" === f && (f = "container_item[" + a + "]"))
    r > 0 && (s += "\n" + this.indent(1) + "passed_filtered_artifact_data = phantom.collect2(container=container, ", s += "datapath=" + L + ", filter_artifacts=filtered_artifacts)", "filtered_container" === D && "" === f && (f = "passed_filtered_artifact_item[" + r + "]"))
    _.each(k, function (t, i) {
      var n = _.map(b[t], function (t) {
        return "'" + t + "'"
      });
      n.push("'" + t + ":action_result.parameter.context.artifact_id'");
      var o = "[" + n.join(", ") + "]";
      s += "\n" + e.indent(1) + "results_data_" + (i + 1) + " = phantom.collect2(container=container, datapath=" + o + ", action_results=results)", "results" === D && "" === f && (f = "results_item_" + (i + 1) + "[" + (n.length - 1) + "]")
    })
    _.each(I, function (t, i) {
      var n = _.map(y[t], function (t) {
        return "'" + t + "'"
      });
      n.push("'" + t + ":artifact:*.id'");
      var o = "[" + n.join(", ") + "]";
      s += "\n" + e.indent(1) + "inputs_data_" + (i + 1) + " = phantom.collect2(container=container, datapath=" + o + ", action_results=results)", "inputs" === D && "" === f && (f = "inputs_item_" + (i + 1) + "[" + (n.length - 1) + "]")
    })
    _.each(M, function (t, i) {
      var n = _.map(v[t], function (t) {
        return "'" + t + "'"
      });
      n.push("'" + t + ":artifact:*.id'");
      var o = "[" + n.join(", ") + "]";
      s += "\n" + e.indent(1) + "filtered_artifacts_data_" + (i + 1) + " = phantom.collect2(container=container, datapath=" + o + ")", "filtered-artifacts" === D && "" === f && (f = "filtered_artifacts_item_" + (i + 1) + "[" + (n.length - 1) + "]")
    })
    _.each(A, function (t, i) {
      var n = _.map(w[t], function (t) {
        return '"' + t + '"'
      });
      n.push('"' + t + ':action_result.parameter.context.artifact_id"');
      var o = "[" + n.join(", ") + "]";
      s += "\n" + e.indent(1) + "filtered_results_data_" + (i + 1) + " = phantom.collect2(container=container, datapath=" + o + ")", "filtered" === D && "" === f && (f = "filtered_results_item_" + (i + 1) + "[" + (n.length - 1) + "]")
    }), _.each(S, function (t, i) {
      var n = _.map(x[t], function (t) {
        return '"' + t + '"'
      });
      n.push('"' + t + ':filtered-action_result.parameter.context.artifact_id"');
      var o = "[" + n.join(", ") + "]";
      s += "\n" + e.indent(1) + "passed_filtered_results_data_" + (i + 1) + " = phantom.collect2(container=container, datapath=" + o + ", action_results=filtered_results)", "legacy-filtered" === D && "" === f && (f = "passed_filtered_results_item_" + (i + 1) + "[" + (n.length - 1) + "]")
    }), _.each(T, function (t, i) {
      s += "\n" + e.indent(1) + "formatted_data_" + (i + 1) + " = phantom.get_format_data(name='" + t + "')"
    });
    var O = 0;
    return s += "\n", o += "\n", n.length > 0 && (o += e.indent(1) + "# build parameters list for '" + t.getFunctionName() + "' call\n"), a > 0 && (O += 1, o += e.indent(O) + "for container_item in container_data:\n"), r > 0 && (O += 1, o += e.indent(O) + "for passed_filtered_artifact_item in passed_filtered_artifact_data:\n"), _.each(C, function (t, i) {
      t.is_list && (O += 1, o += e.indent(O) + "for formatted_part_" + t.idx + " in formatted_data_" + t.idx + ":\n")
    }), _.each(M, function (t, i) {
      O += 1, o += e.indent(O) + "for filtered_artifacts_item_" + (i + 1) + " in filtered_artifacts_data_" + (i + 1) + ":\n"
    }), _.each(k, function (t, i) {
      O += 1, o += e.indent(O) + "for results_item_" + (i + 1) + " in results_data_" + (i + 1) + ":\n"
    }), _.each(I, function (t, i) {
      O += 1, o += e.indent(O) + "for inputs_item_" + (i + 1) + " in inputs_data_" + (i + 1) + ":\n"
    }), _.each(A, function (t, i) {
      O += 1, o += e.indent(O) + "for filtered_results_item_" + (i + 1) + " in filtered_results_data_" + (i + 1) + ":\n"
    }), _.each(S, function (t, i) {
      O += 1, o += e.indent(O) + "for passed_filtered_results_item_" + (i + 1) + " in passed_filtered_results_data_" + (i + 1) + ":\n"
    }), _.keys(i).length > 0 && (N.length > 0 && (O += 1, o += e.indent(O) + "if ", _.each(_.unique(N), function (t, e) {
      0 !== e && (o += " and "), o += t
    }), o += ":\n"), o += e.indent(O + 1) + "parameters.append({\n", _.each(_.keys(i), function (t, i) {
      o += e.indent(O + 2) + "'" + t + "': " + n[i] + ",\n"
    }), "" !== f && (o += e.indent(O + 2) + "# context (artifact id) is added to associate results with the artifact\n", o += e.indent(O + 2) + "'context': {'artifact_id': " + f + "},\n"), o += e.indent(O + 1) + "})\n"), t.get("show_delay") && t.get("delay") > 0 && (o += e.indent(1) + "# calculate start time using delay of " + t.get("delay") + " minutes\n", o += e.indent(1) + "start_time = datetime.now() + timedelta(minutes=" + t.get("delay") + ")\n"), {
      collect: s,
      loop: o
    }
  }
})
