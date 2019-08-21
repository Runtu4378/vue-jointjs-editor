/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'

export default _bb.View.extend({
  getPosition: function () {
    return this.$el[0].getBoundingClientRect().x
  },
  setPosition: function (t) {
    var e = this.$el
    e.css('transition', 'none')
    e.css('transform', 'translateX(' + t + 'px)')
    e.css('transition', '')
    return e
  },
  animatePosition: function (t, e) {
    var i = this
    var n = i.$el
    var s = 'transitionend.drawer webkitTransitionEnd.drawer oTransitionEnd.drawer'
    n.off(s)
    e && n.one(s, function () {
      e()
    })
    n.css('transform', 'translateX(' + t + 'px)')
    return n
  },
})
