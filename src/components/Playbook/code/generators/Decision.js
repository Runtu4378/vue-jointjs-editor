/**decision */
import Base from './Base'
import {
  template,
  str
} from '../utils'

export default Base.extend({
  initialize: function () {
    Base.prototype.initialize.apply(this)
    this.name = 'decision'
  },
  updateTemplate: function (type) {

    const templateDecision = this.templates.findWhere({ type: type })
    this.template = templateDecision
      ? template(templateDecision.get('info'))
      : template('')

  },
  blockFunction: function (block) {
    const funcName = block.getFunctionName()
    const condition_view = block.outputs.models
    var   conditions = '',
          elif = '',
          else_tmp = '',
          temp_elseprops = {},
          temp_props = {},
          callback_temp = '',
          callback_props = {}
    if (condition_view.length > 1) {
      //有else if的情况

      condition_view.forEach((el, i) => {
        if (!i || !condition_view[i].conditions.models.length) { return }
        var views = condition_view[i].conditions.models
        var type = condition_view[i] && condition_view[i].get('type')
        var logic = condition_view[i] && condition_view[i].get('logic')
        var temp_conditions = ''
        type == 'else' ? (
          
          this.updateTemplate('Decisionelse'),

          temp_elseprops = {
            callback: this.generateCallbackNameByPort(block, `out-${i + 1}`)
          },
          else_tmp += '\n' + this.template({
            ...block.toJSON(),
            ...temp_elseprops,
          })
        )
          :
          (views.forEach(el => {
            this.updateTemplate('Callback'),
            callback_props = {
              result: `matched_results_${i + 1}`,
              nodeCallback: this.generateCallbackNameByPort(block, `out-${i + 1}`)
            },
            callback_temp = this.template({
              ...block.toJSON(),
              ...callback_props,
            }),

            this.updateTemplate('Decisionelif')
            temp_conditions += '\n' + this.indent(3) + '[' + str(el.get('param')) + ',' + str(el.get('comparison')) + ',' + str(el.get('value')) + ']' + ','
            temp_conditions = temp_conditions.replace(/(^\s*)/g, "")
            
            temp_props = {
                funcName: funcName,
                conditions: temp_conditions,
                logicalOperator: str(logic),
                search: '',
                result: `matched_results_${i + 1}`,
                callback_temp: callback_temp
              }
          }),
            elif += this.indent(2) + this.template({
              ...block.toJSON(),
              ...temp_props,
            }))
      })
    }
    //if的情况
    var condition_data = condition_view[0].conditions.models
    condition_data && condition_data.forEach(el => {
      conditions += '\n' + this.indent(3) + '[' + str(el.get('param')) + ',' + str(el.get('comparison')) + ',' + str(el.get('value')) + ']' + ','
    })
    conditions = conditions.replace(/(^\s*)/g, "")

    this.updateTemplate('Callback')

    callback_props = {
      result: 'matched_results_1',
      nodeCallback: this.generateCallbackNameByPort(block, `out-1`)
    }
    callback_temp = this.template({
      ...block.toJSON(),
      ...callback_props,
    })
    elif = elif.replace(/(^\s*)|(\s*$)/g, "")
    const props = {
      funcName: funcName,
      conditions,
      logicalOperator: str(condition_view[0].get('logic')),
      elif,
      else_tmp: else_tmp,
      search: '',
      result: `matched_results_1`,
      callback_temp: callback_temp
    }
    this.updateTemplate('Decisionif')
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
