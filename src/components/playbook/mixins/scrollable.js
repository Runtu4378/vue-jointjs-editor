/* eslint comma-dangle: ["error", "always-multiline"] */

import _ from 'underscore'

export default {
  trackOffset: -20,
  contentOffset: 0,
  trackClass: '.scroller-track',
  handleClass: '.scroller-handle',
  contentClass: '.scroller-content',
  initScrollable: function () {
    this.showScroll = !1
    this.percent = 0
    this.trackHeight = 0
    this.contentHeight = 0
    this.trackRatio = 0
    this.handleHeightBeforeRerender = 0
    this.listenTo(this.dispatcher, 'document:resize', this.updateSize)
  },
  renderScrollable: function () {
    this.$track = this.$el.find(this.trackClass)
    this.$handle = this.$el.find(this.handleClass)
    this.$content = this.$el.find(this.contentClass)
    this.$container = this.$content.parent()
    this.$handle.draggable({
      containment: 'parent',
    }).on('drag', _.bind(this.handleDrag, this))
    this.fixHandleInPlace()
    setTimeout(_.bind(this.updateSize, this), 100)
  },
  removeScrollable: function () {
    this.$handle && this.$handle.draggable().off('drag')
  },
  updateSize: function () {
    if (this.$content) {
      this.contentHeight = this.$content.height()
      this.trackHeight = this.$container.innerHeight()
      this.trackRatio = this.contentHeight / this.trackHeight
      if (this.contentHeight <= this.trackHeight) {
        this.$el.addClass('no-scroll')
        this.showScroll = !1
      } else {
        this.$track.css({
          height: this.trackHeight,
        })
        this.$el.removeClass('no-scroll')
        this.showScroll = !0
      }
      this.$el.is(':hover') && this.showScroller()
      this.fixHandleInPlace()
      this.updateHandle()
    }
  },
  fixHandleInPlace: function () {
    var t = this.$content.height()
    var e = this.handleHeightBeforeRerender / (this.trackHeight - this.$handle.height())
    this.percent = e
    this.$content.css({
      top: -((t - this.trackHeight + this.contentOffset) * this.percent),
    })
  },
  handleDrag: function (t, e) {
    e.position.top < 0 && (e.position.top = 0)
    e.position.left < 0 && (e.position.left = 0)
    this.updateScroll()
  },
  updateScroll: function (t) {
    this.percent = this.$handle.position().top / (this.trackHeight - this.$handle.height())
    this.$content.css({
      top: -((this.contentHeight - this.trackHeight + this.contentOffset) * this.percent),
    })
    this.handleHeightBeforeRerender = this.$handle.position().top
  },
  updateHandle: function () {
    this.$handle.css({
      top: (this.trackHeight - this.$handle.height()) * this.percent,
    })
  },
  handleWheel: function (t) {
    if (this.showScroll) {
      t.preventDefault()
      t.stopPropagation()
      var e = t.originalEvent
      var i = e.wheelDelta ? e.wheelDelta : -120 * e.deltaY
      var n = i / 120
      var s = this.$handle.position().top - n * (32 / this.trackRatio)
      s < 0 ? s = 0 : s > this.trackHeight - this.$handle.height() && (s = this.trackHeight - this.$handle.height())
      this.$handle.css({
        top: s,
      })
      this.updateScroll()
    }
  },
  showScroller: function () {
    this.showScroll && this.$track.fadeIn(300)
  },
  hideScroller: function () {
    this.showScroll && this.$track.fadeOut(300)
  },
  resetScroller: function () {
    this.$handle.css({
      top: 0,
    })
    this.updateScroll()
  },
}
