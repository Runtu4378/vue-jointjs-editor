/* eslint comma-dangle: ["error", "always-multiline"] */
/* globals $ */

import _bb from 'backbone'

export default _bb.View.extend({
  render: function () {
    return this
  },
  remove: function () {
    var t = this
    $('#loader').delay(300).fadeOut(500, function () {
      $(this).hide()
      t.coa.missing_assets.length > 0 && t.dispatcher.trigger('resolve:open')
      t.coa.missing_message !== '' && t.dispatcher.trigger('notification:show', {
        message: t.coa.missing_message,
        autoHide: false,
        type: 'error',
      })
    })
  },
  set: function (t) {
    $('#loader .status').html(t)
  },
  error: function (t) {
    $('#loader .loading, #loader .status').remove()
    $('#loader .error').append('<div>' + t + '</div>')
  },
})
