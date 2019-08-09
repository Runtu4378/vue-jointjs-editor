/* eslint comma-dangle: ["error", "always-multiline"] */

import _ from 'underscore'

import Base from './base'

const startTemplate = "def on_start(container):\n    phantom.debug('on_start() called')\n    <%= function_calls %>\n\n    return\n"
const finishTemplate = "def on_finish(container, summary):\n    phantom.debug('on_finish() called')\n    # This function is called after all actions are completed.\n    # summary of all the action and/or all detals of actions \n    # can be collected here.\n\n    # summary_json = phantom.get_summary()\n    # if 'result' in summary_json:\n        # for action_result in summary_json['result']:\n            # if 'action_run_id' in action_result:\n                # action_results = phantom.get_action_results(action_run_id=action_result['action_run_id'], result_data=False, flatten=False)\n                # phantom.debug(action_results)\n\n    return\n\n"

export default Base.extend({
  initialize: function () {
    Base.prototype.initialize.apply(this)
    this.startTemplate = _.template(startTemplate)
    this.finishTemplate = _.template(finishTemplate)
  },
  render: function (t) {
    var e = this
    var i = {
      code: '',
      title: '',
    }
    var n = t.get('custom_code')
    if (t.get('title') === 'START') {
      if (!n) {
        var s = t.outbound
        var o = ''
        _.each(s, function (t) {
          o += '\n' + e.indent(1) + "# call '" + t.function_name + "' block"
          o += '\n' + e.indent(1) + t.function_name + '(container=container)\n'
        })
        var a = {
          function_calls: o,
        }
        n = this.startTemplate(a)
      }
      i = {
        title: 'on_start',
        code: n,
      }
    } else {
      n || (n = this.finishTemplate(a))
      i = {
        title: 'on_finish',
        code: n,
      }
    }
    return i
  },
})
