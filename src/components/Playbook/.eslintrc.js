// https://eslint.org/docs/user-guide/configuring

module.exports = {
  globals: {
    '$': true,
    'Backbone': true,
    '_': true,
    'joint': true
  },
  // add your custom rules here
  rules: {
    'comma-dangle': ["error", "always-multiline"]
  }
}
