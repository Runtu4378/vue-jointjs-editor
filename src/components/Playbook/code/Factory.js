import {
  template,
} from './utils'

import Startend from './generators/Startend'
import Action from './generators/Action'
import Filter from './generators/Filter'
import Decision from './generators/Decision'

export default Backbone.View.extend({
  initialize: function () {
    this.startend = new Startend()
    this.action = new Action()
    this.filter = new Filter()
    this.decision = new Decision()
  },
  render: function (model, codeView) {
    let result = {
      code: ' ',
      title: '',
    }

    if (!model) {
      return result
    }

    const n = model.get('type')

    switch (n) {
      case 'coa.Action':
        result = this.action.render(model, codeView)
        break
      case 'coa.Filter':
        result = this.filter.render(model, codeView)
        break
      case 'coa.Decision':
        result = this.decision.render(model, codeView)
        break
      case 'coa.StartEnd':
        result = this.startend.render(model, codeView)
        break
      default:
        break
    }

    if (result && result.code) {
      result.code = result.code.replace(/\n\s*\n\s*\n/g, '\n\n').replace(/^\s+|\s+$/g, '')
    }

    return result
  },
  renderFullPlaybook: function (state) {
    let codeFull = ''
    let codeBlocks = ''
    const codeEnd = ''
    let lineNum = 0
    // const codeStart = this.template()
    const templateImports = this.templates.findWhere({ type: 'Imports' })
    const codeStart = templateImports
      ? template(templateImports.get('info'))({ importModel: '' })
      : ''

    const description = this.playbook.get('description')

    if (description !== '') {
      codeFull += '"""\n'
      codeFull += description + '\n'
      codeFull += '"""\n\n'
    }

    lineNum += description.split(/\r\n|\r|\n/).length + 3
    codeFull += codeStart
    lineNum = codeFull.split(/\r\n|\r|\n/).length

    this.coa.set('globalBlockStart', lineNum)

    const blockStart = this.blocks.findWhere({
      type: 'coa.StartEnd',
      blockType: 'start',
    })
    const blockEnd = this.blocks.findWhere({
      type: 'coa.StartEnd',
      blockType: 'end',
    })

    const resultStart = this.render(blockStart, true)
    blockStart.set('line_start', lineNum)
    codeFull += resultStart.code + '\n'
    lineNum += resultStart.code.split(/\r\n|\r|\n/).length + 1
    blockStart.set('line_end', lineNum)

    _.each(this.blocks.models, (block) => {
      const type = block.get('type')
      if (type !== 'coa.StartEnd') {
        const resultBlock = this.render(block, 'block')

        // if (block.get('description') !== '') {
        //   const code = '\n"""\n' + block.get('description') + '\n"""'
        //   codeBlocks += code
        //   lineNum += code.split(/\r\n|\r|\n/).length - 1
        // }

        block.set('line_start', lineNum)
        codeBlocks += '\n' + resultBlock.code + '\n'
        lineNum += resultBlock.code.split(/\r\n|\r|\n/).length + 1

        block.set('line_end', lineNum)
      }
    })

    const resultEnd = this.render(blockEnd, true)
    const lineOfEnd = (codeFull + codeBlocks).split(/\r\n|\r|\n/).length + 1

    codeBlocks += '\n' + resultEnd.code
    blockEnd.set('line_start', lineOfEnd)
    blockEnd.set('line_end', (codeFull + codeBlocks + codeEnd).split(/\r\n|\r|\n/).length)

    return codeFull + codeBlocks + codeEnd
  },
})
