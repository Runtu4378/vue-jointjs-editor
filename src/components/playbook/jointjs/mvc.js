/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone' // e
import _lo from 'lodash' // n
import $ from 'jquery' // s
import * as joint from 'jointjs' // u

// joint.V -> l
// joint.V.g -> h

export default _bb.View.extend({
  options: {},
  theme: null,
  themeClassNamePrefix: joint.util.addClassNamePrefix('theme-'),
  requireSetThemeOverride: !1,
  defaultTheme: joint.config.defaultTheme,
  constructor: function (t) {
    _bb.View.call(this, t)
  },
  initialize: function (t) {
    this.requireSetThemeOverride = t && !!t.theme
    this.options = _lo.extend({}, this.options, t)
    _lo.bindAll(this, 'setTheme', 'onSetTheme', 'remove', 'onRemove')
    joint.mvc.views[this.cid] = this
    this.setTheme(this.options.theme || this.defaultTheme)
    this._ensureElClassName()
    this.init()
  },
  _ensureElement: function () {
    var t
    if (this.svgElement) {
      if (this.el) {
        t = _lo.result(this, 'el')
      } else {
        var i = _lo.extend({
          id: this.id,
        }, _lo.result(this, 'attributes'))
        this.className && (i['class'] = _lo.result(this, 'className'))
        t = joint.V(_lo.result(this, 'tagName'), i).node
      }
      this.setElement(t, !1)
    } else _bb.View.prototype._ensureElement.call(this)
  },
  _setElement: function (t) {
    if (this.svgElement) {
      this.$el = t instanceof _bb.$
        ? t
        : _bb.$(t)
      this.el = this.$el[0]
      this.vel = joint.V(this.el)
    } else {
      _bb.View.prototype._setElement.call(this, t)
    }
  },
  _ensureElClassName: function () {
    var t = _lo.result(this, 'className')
    var e = joint.util.addClassNamePrefix(t)
    this.$el.removeClass(t)
    this.$el.addClass(e)
  },
  init: function () {},
  onRender: function () {},
  setTheme: function (t, e) {
    e = e || {}
    if (this.theme && this.requireSetThemeOverride && !e.override) {
      return this
    } else {
      this.removeThemeClassName()
      this.addThemeClassName(t)
      this.onSetTheme(this.theme, t)
      this.theme = t
      return this
    }
  },
  addThemeClassName: function (t) {
    t = t || this.theme
    var e = this.themeClassNamePrefix + t
    this.$el.addClass(e)
    return this
  },
  removeThemeClassName: function (t) {
    t = t || this.theme
    var e = this.themeClassNamePrefix + t
    this.$el.removeClass(e)
    return this
  },
  onSetTheme: function (t, e) {},
  remove: function () {
    this.onRemove()
    joint.mvc.views[this.cid] = null
    _bb.View.prototype.remove.apply(this, arguments)
    return this
  },
  onRemove: function () {},
  getEventNamespace: function () {
    return '.joint-event-ns-' + this.cid
  },
}, {
  extend: function () {
    var t = Array.prototype.slice.call(arguments)
    var i = t[0] && _lo.clone(t[0]) || {}
    var s = t[1] && _lo.clone(t[1]) || {}
    var o = i.render || this.prototype && this.prototype.render || null
    i.render = function () {
      o && o.apply(this, arguments)
      this.onRender()
      return this
    }
    return _bb.View.extend.call(this, i, s)
  },
})
