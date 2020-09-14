import Base from './Base'
import {
  template,
} from '../utils'

export default Base.extend({
  initialize: function () {
    Base.prototype.initialize.apply(this)
  },
  updateTemplate: function () {
    const templateOnstart = this.templates.findWhere({ type: 'Onstart' })
    const templateFinish = this.templates.findWhere({ type: 'Finish' })

    this.startTemplate = templateOnstart
      ? template(templateOnstart.get('info'))
      : template('')
    this.finishTemplate = templateFinish
      ? template(templateFinish.get('info'))
      : template('')
  },
  render: function (block) {
    const that = this
    let result = {
      code: '',
      title: '',
    }
    let customCode = block.get('custom_code')

    this.updateTemplate()

    if (block.get('blockType') === 'start') {
      if (!customCode) {
        const outbound = block.outbound
        let callback = ''
        _.each(outbound, (t) => {
          callback += '\n' + that.indent(1) + '# call \'' + t.function_name + '\' block'
          callback += '\n' + that.indent(1) + t.function_name + '(container=container)\n'
        })
        const props = { callback }
        customCode = this.startTemplate(props)
      }
      result = {
        title: 'on_start',
        code: customCode,
      }
    } else if (!customCode) {
      customCode = this.finishTemplate()
      result = {
        title: 'on_finish',
        code: customCode,
      }
    }
    return result
  },
})
