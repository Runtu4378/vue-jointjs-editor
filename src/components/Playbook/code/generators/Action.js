import Base from './Base'
import {
  template,
  str,
} from '../utils'

const templateMessage = `
def {{ funcName }}(container):
    parameters = {
        {{ parameters }}
    }
    Falcon.action(
        container=container,
        parameters=parameters,
        plugin_name={{ pluginName }},
        action_name="{{ funcName }}",
        name={{ name }}
    )

    {{ callback }}

    return

    `

export default Base.extend({
  initialize: function () {
    Base.prototype.initialize.apply(this)
  },
  updateTemplate: function (block) {
    const templateAction = this.templates.findWhere({ type: 'Action' })

    this.template = template('')

    if (templateAction) {
      this.template = template(templateAction.get('info'))
    }
    if (block.get('action') === 'message_template') {
      this.template = template(templateMessage)
    }
  },
  blockFunction: function (block) {
    const action = block.get('action')
    const funcName = block.getFunctionName()
    const fields = block.get('fields')
    let parameters = ''
    this.updateTemplate(block)

    if (fields) {
      const arr = Object.keys(fields)
      // const len = arr.length
      arr.forEach((key, idx) => {
        const plus = str(key) + ': ' + str(fields[key], 2)
        parameters += '\n' + this.indent(2) + plus + ','
      })
    }

    const props = {
      funcName: funcName,
      pluginName: str(block.get('app')),
      name: str(action),
      parameters,
      callback: this.generateCallbackName(block),
    }

    const code = this.template({
      ...block.toJSON(),
      ...props,
    })

    return {
      title: funcName,
      code,
    }
  },
})
