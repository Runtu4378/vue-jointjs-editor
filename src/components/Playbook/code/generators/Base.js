export default Backbone.View.extend({
  initialize: function () {
    this.indentWidth = '    '
  },
  render: function (block, codeView) {
    if (codeView === 'block') {
      return this.blockFunction(block)
    }
  },

  indent: function (tabNum) {
    if (typeof tabNum === 'undefined' || typeof tabNum !== 'number' || tabNum < 1) {
      tabNum = 1
    }
    return _.repeat(this.indentWidth, tabNum)
  },
  generateCallbackName: function (block) {
    const outbound = block.outbound

    let str = ''
    for (let i = 0; i < outbound.length; i += 1) {
      const item = outbound[i]
      if (item.type === 'coa.StartEnd') {
        continue
      }
      if (i !== 0) {
        str += this.indent(1)
      }
      str += item.function_name + '(container)\n'
    }

    return str
  },
  generateCallbackNameByPort: function (block,port) {
    const outbound = block.outbound
    let str = ''
    for (let i = 0; i < outbound.length; i += 1) {
      const item = outbound[i]
      if (item.type === 'coa.StartEnd') {
        continue
      }
      if (item.port == port) {
        str = item.function_name + '(container)\n'
      }
    }
    return str
  },
})
