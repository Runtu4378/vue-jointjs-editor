export const indent = (tabNum) => {
  const indentWidth = '    '

  if (typeof tabNum === 'undefined' || typeof tabNum !== 'number' || tabNum < 1) {
    tabNum = 1
  }
  return _.repeat(indentWidth, tabNum)
}

export const template = (temp) => {
  return _.template(temp, {
    interpolate: /{{([\s\S]+?)}}/g,
  })
}

export const str = (value, baseIndent) => {
  if (_.isArray(value)) {
    let plus = ''

    value.forEach(item => {
      plus += indent(baseIndent + 1) + str(item, baseIndent) + ',\n'
    })

    return '[\n' + plus + indent(baseIndent) + ']'
  }
  if (value === undefined) {
    return `""`
  } else {
    return '"' + value.replace(/\n/g, '\\n') + '"'
  }
}
