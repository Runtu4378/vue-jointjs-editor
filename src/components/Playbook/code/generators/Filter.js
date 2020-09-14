/** filter */
import Base from './Base'
import {
  template,
  str,
} from '../utils'

export default Base.extend({
  initialize: function () {
    Base.prototype.initialize.apply(this)
    this.name = 'filter'
  },
  updateTemplate: function (type) {
    const templateFilter = this.templates.findWhere({ type: type })
    this.template = templateFilter
      ? template(templateFilter.get('info'))
      : template('')
  },
  blockFunction: function (block) {
    const funcName = block.getFunctionName()
    const condition_view = block.get('conditions')

    var conditions = ''
    var callback_props = {}
    var callback_temp = ''
    const condition_data = block.outputs.models[0].conditions.models

    condition_data.forEach(el=>{
      conditions +='\n'+ this.indent(3)+'[' + str(el.get('param')) + ',' + str(el.get('comparison')) + ',' + str(el.get('value')) + ']' +','
    });

    this.updateTemplate('Callback')

    callback_props = {
      result: 'matched_results_1',
      nodeCallback: this.generateCallbackNameByPort(block, `out-1`),
    }
    callback_temp = this.template({
      ...block.toJSON(),
      ...callback_props,
    })
    const props = {
      funcName:funcName,
      result: 'matched_results_1',
      conditions: conditions.replace(/(^\s*)/g,""),
      search:'',
      logicalOperator: str(block.outputs.models[0]&&block.outputs.models[0].get('logic')),
      callback_temp
    }

    this.updateTemplate('Filter')
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
