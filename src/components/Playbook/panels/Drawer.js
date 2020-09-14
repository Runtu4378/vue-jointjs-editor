export default Backbone.View.extend({
  getPosition: function () {
    return this.$el[0].getBoundingClientRect().x
  },
  setPosition: function (left) {
    var dom = this.$el
    dom.css('transition', 'none')
    dom.css('transform', 'translateX(' + left + 'px)')
    dom.css('transition', '')
    return dom
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
