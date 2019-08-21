/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'
import $ from 'jquery' // s
import _ from 'underscore'
import {
  mvc,
  util, // n
  V, // l
  g, // h
} from 'jointjs' // u

export default mvc.View.extend({
  options: {
    paper: void 0,
    graph: void 0,
    boxContent: function (t) {
      return util.template('<%= length %> elements selected.')({
        length: this.model.length,
      })
    },
    handles: [
      {
        name: 'remove',
        position: 'nw',
        events: {
          pointerdown: 'removeElements',
        },
      },
      {
        name: 'rotate',
        position: 'sw',
        events: {
          pointerdown: 'startRotating',
          pointermove: 'doRotate',
          pointerup: 'stopBatch',
        },
      },
      {
        name: 'resize',
        position: 'se',
        events: {
          pointerdown: 'startResizing',
          pointermove: 'doResize',
          pointerup: 'stopBatch',
        },
      },
    ],
    useModelGeometry: false,
    strictSelection: false,
    rotateAngleGrid: 15,
    allowTranslate: true,
  },
  className: 'selection',
  events: {
    'mousedown .selection-box': 'onSelectionBoxPointerDown',
    'touchstart .selection-box': 'onSelectionBoxPointerDown',
    'mousedown .handle': 'onHandlePointerDown',
    'touchstart .handle': 'onHandlePointerDown',
  },
  init: function () {
    this.options.model && (this.options.collection = this.options.model)
    var t = this.collection = this.options.collection || this.collection || new _bb.Collection()
    if (!t.comparator) {
      t.comparator = this.constructor.depthComparator
      t.sort()
    }
    this.model = t
    if (!this.options.paper) {
      throw new Error('Selection: paper required')
    }

    util.defaults(this.options, {
      graph: this.options.paper.model,
    })
    util.bindAll(this, 'startSelecting', 'stopSelecting', 'adjustSelection', 'pointerup')

    $(document.body).on('mousemove.selection touchmove.selection', this.adjustSelection)
    $(document).on('mouseup.selection touchend.selection', this.pointerup)

    const i = this.options.paper
    const o = this.options.graph
    this.listenTo(o, 'reset', this.cancelSelection)
    this.listenTo(i, 'scale translate', this.updateSelectionBoxes)
    this.listenTo(o, 'remove change', function (t, e) {
      e.selection !== this.cid && this.updateSelectionBoxes()
    })
    this.listenTo(t, 'remove', this.onRemoveElement)
    this.listenTo(t, 'reset', this.onResetElements)
    this.listenTo(t, 'add', this.onAddElement)
    i.$el.append(this.$el)
    this._boxCount = 0
    this.$selectionWrapper = this.createSelectionWrapper()
    this.handles = []
    _.each(this.options.handles, this.addHandle, this)
  },
  cancelSelection: function () {
    this.model.reset([], {
      ui: true,
    })
  },
  addHandle: function (t) {
    this.handles.push(t)
    var e = $('<div/>', {
      'class': 'handle ' + (t.position || '') + ' ' + (t.name || ''),
      'data-action': t.name,
    })
    t.icon && e.css('background-image', 'url(' + t.icon + ')')
    e.html(t.content || '')
    util.setAttributesBySelector(e, t.attrs)
    this.$selectionWrapper.append(e)
    _.each(t.events, function (e, i) {
      util.isString(e)
        ? this.on('action:' + t.name + ':' + i, this[e], this)
        : this.on('action:' + t.name + ':' + i, e)
    }, this)
    return this
  },
  stopSelecting: function (t) {
    switch (this._action) {
      case 'selecting':
        var e = this.$el.offset()
        var i = this.$el.width()
        var s = this.$el.height()
        var o = this.options.paper
        var a = V(o.viewport).toLocalPoint(e.left, e.top)

        a.x -= window.pageXOffset
        a.y -= window.pageYOffset
        var r = o.scale()
        i /= r.sx
        s /= r.sy
        var c = g.rect(a.x, a.y, i, s)
        var u = this.getElementsInSelectedArea(c)
        var d = this.options.filter

        if (util.isArray(d)) {
          u = util.reject(u, function (t) {
            return util.contains(d, t.model) || util.contains(d, t.model.get('type'))
          })
        } else {
          util.isFunction(d) && (u = util.reject(u, function (t) {
            return d(t.model)
          }))
        }
        this.model.reset(util.pluck(u, 'model'), {
          ui: true,
        })
        break
      case 'translating':
        this.options.graph.stopBatch('selection-translate')
        this.notify('selection-box:pointerup', t)
        break
      default:
        this._action || this.cancelSelection()
    }
    this._action = null
  },
  removeHandle: function (t) {
    var e = _.findIndex(this.handles, {
      name: t,
    })
    var i = this.handles[e]
    if (i) {
      _.each(i.events, function (e, i) {
        this.off('action:' + t + ':' + i)
      }, this)
      this.$('.handle.' + t).remove()
      this.handles.splice(e, 1)
    }
    return this
  },
  startSelecting: function (t) {
    t = util.normalizeEvent(t)
    this.cancelSelection()
    var e
    var i
    var n = this.options.paper.el
    if (
      t.offsetX !== null &&
      t.offsetY !== null &&
      $.contains(n, t.target)
    ) {
      e = t.offsetX
      i = t.offsetY
    } else {
      var o = $(n).offset()
      var a = n.scrollLeft
      var r = n.scrollTop
      e = t.clientX - o.left + window.pageXOffset + a
      i = t.clientY - o.top + window.pageYOffset + r
    }
    this.$el.css({
      width: 1,
      height: 1,
      left: e,
      top: i,
    })
    this.showLasso()
    this._action = 'selecting'
    this._clientX = t.clientX
    this._clientY = t.clientY
    this._offsetX = e
    this._offsetY = i
  },
  changeHandle: function (t, e) {
    var i = _.findWhere(this.handles, {
      name: t,
    })
    if (i) {
      this.removeHandle(t)
      this.addHandle(util.merge({
        name: t,
      }, i, e))
    }
    return this
  },
  onSelectionBoxPointerDown: function (t) {
    t.stopPropagation()
    t = util.normalizeEvent(t)
    this.options.allowTranslate && this.startTranslatingSelection(t)
    this._activeElementView = this.getCellView(t.target)
    this.notify('selection-box:pointerdown', t)
  },
  startTranslatingSelection: function (t) {
    this._action = 'translating'
    this.options.graph.startBatch('selection-translate')
    var e = this.options.paper.snapToGrid({
      x: t.clientX,
      y: t.clientY,
    })
    this._snappedClientX = e.x
    this._snappedClientY = e.y
  },
  adjustSelection: function (t) {
    t = util.normalizeEvent(t)
    var e
    var i
    switch (this._action) {
      case 'selecting':
        e = t.clientX - this._clientX
        i = t.clientY - this._clientY
        var n = parseInt(this.$el.css('left'), 10)
        var s = parseInt(this.$el.css('top'), 10)
        this.$el.css({
          left: e < 0 ? this._offsetX + e : n,
          top: i < 0 ? this._offsetY + i : s,
          width: Math.abs(e),
          height: Math.abs(i),
        })
        break
      case 'translating':
        var o = this.options.paper.snapToGrid({
          x: t.clientX,
          y: t.clientY,
        })
        var a = o.x
        var r = o.y
        e = a - this._snappedClientX
        i = r - this._snappedClientY
        if (e || i) {
          this.translateSelectedElements(e, i)
          if (this.boxesUpdated) {
            this.model.length > 1 && this.updateSelectionBoxes()
          } else {
            var l = this.options.paper.scale()
            this.$el.children('.selection-box').add(this.$selectionWrapper).css({
              left: '+=' + e * l.sx,
              top: '+=' + i * l.sy,
            })
          }
          this._snappedClientX = a
          this._snappedClientY = r
        }
        this.notify('selection-box:pointermove', t)
        break
      default:
        this._action && this.pointermove(t)
    }
    this.boxesUpdated = false
  },
  translateSelectedElements: function (t, e) {
    var i = {}
    this.model.each(function (s) {
      if (!i[s.id]) {
        var o = {
          selection: this.cid,
        }
        s.translate(t, e, o)
        _.each(s.getEmbeddedCells({
          deep: true,
        }), function (t) {
          i[t.id] = true
        })
        var a = this.options.graph.getConnectedLinks(s)
        _.each(a, function (n) {
          if (!i[n.id]) {
            n.translate(t, e, o)
            i[n.id] = true
          }
        })
      }
    }, this)
  },
  notify: function (t, e) {
    var i = Array.prototype.slice.call(arguments, 1)
    this.trigger.apply(this, [t, this._activeElementView].concat(i))
  },
  getElementsInSelectedArea: function (t) {
    var e = this.options.paper
    var i = {
      strict: this.options.strictSelection,
    }
    if (this.options.useModelGeometry) {
      var s = e.model.findModelsInArea(t, i)
      return util.filter(util.map(s, e.findViewByModel, e))
    }
    return e.findViewsInArea(t, i)
  },
  pointerup: function (t) {
    if (this._action) {
      this.triggerAction(this._action, 'pointerup', t)
      this.stopSelecting(t)
      this._activeElementView = null
      this._action = null
    }
  },
  destroySelectionBox: function (t) {
    this.$('[data-model="' + t.get('id') + '"]').remove()
    this.$el.children('.selection-box').length === 0 && this.hide()
    this._boxCount = Math.max(0, this._boxCount - 1)
  },
  hide: function () {
    this.$el.removeClass('lasso selected')
  },
  showSelected: function () {
    this.$el.addClass('selected')
  },
  showLasso: function () {
    this.$el.addClass('lasso')
  },
  destroyAllSelectionBoxes: function () {
    this.hide()
    this.$el.children('.selection-box').remove()
    this._boxCount = 0
  },
  createSelectionBox: function (t) {
    var e = t.findView(this.options.paper)
    if (e) {
      var i = e.getBBox({
        useModelGeometry: this.options.useModelGeometry,
      })
      $('<div/>')
        .addClass('selection-box')
        .attr('data-model', t.get('id'))
        .css({
          left: i.x,
          top: i.y,
          width: i.width,
          height: i.height,
        })
        .appendTo(this.el)
      this.showSelected()
      this._boxCount++
    }
  },
  createSelectionWrapper: function () {
    var t = $('<div/>', {
      'class': 'selection-wrapper',
    })
    var e = $('<div/>', {
      'class': 'box',
    })
    t.append(e)
    t.attr('data-selection-length', this.model.length)
    this.$el.prepend(t)
    return t
  },
  updateSelectionWrapper: function () {
    var t = {
      x: 1 / 0,
      y: 1 / 0,
    }
    var e = {
      x: 0,
      y: 0,
    }
    this.model.each(function (i) {
      var n = this.options.paper.findViewByModel(i)
      if (n) {
        var s = n.getBBox({
          useModelGeometry: this.options.useModelGeometry,
        })
        t.x = Math.min(t.x, s.x)
        t.y = Math.min(t.y, s.y)
        e.x = Math.max(e.x, s.x + s.width)
        e.y = Math.max(e.y, s.y + s.height)
      }
    }, this)
    this.$selectionWrapper.css({
      left: t.x,
      top: t.y,
      width: e.x - t.x,
      height: e.y - t.y,
    }).attr('data-selection-length', this.model.length)
    if (util.isFunction(this.options.boxContent)) {
      var i = this.$('.box')
      var s = this.options.boxContent.call(this, i[0])
      s && i.html(s)
    }
  },
  updateSelectionBoxes: function () {
    if (this._boxCount) {
      this.hide()
      _.each(this.$el.children('.selection-box'), function (t) {
        var e = $(t).remove().attr('data-model')
        var i = this.model.get(e)
        i && this.createSelectionBox(i)
      }, this)
      this.updateSelectionWrapper()
      this.boxesUpdated = true
    }
  },
  onRemove: function () {
    $(document.body).off('.selection', this.adjustSelection)
    $(document).off('.selection', this.pointerup)
  },
  onHandlePointerDown: function (t) {
    this._action = $(t.target).closest('.handle').attr('data-action')
    if (this._action) {
      t.preventDefault()
      t.stopPropagation()
      t = util.normalizeEvent(t)
      this._clientX = t.clientX
      this._clientY = t.clientY
      this._startClientX = this._clientX
      this._startClientY = this._clientY
      this.triggerAction(this._action, 'pointerdown', t)
    }
  },
  getCellView: function (t) {
    var e = this.model.get(t.getAttribute('data-model'))
    return e && e.findView(this.options.paper)
  },
  pointermove: function (t) {
    if (this._action) {
      var e = this.options.paper.snapToGrid({
        x: t.clientX,
        y: t.clientY,
      })
      var i = this.options.paper.snapToGrid({
        x: this._clientX,
        y: this._clientY,
      })
      var n = e.x - i.x
      var s = e.y - i.y
      this.triggerAction(this._action, 'pointermove', t, n, s, t.clientX - this._startClientX, t.clientY - this._startClientY)
      this._clientX = t.clientX
      this._clientY = t.clientY
    }
  },
  triggerAction: function (t, e, i) {
    var n = Array.prototype.slice.call(arguments, 2)
    n.unshift('action:' + t + ':' + e)
    this.trigger.apply(this, n)
  },
  onRemoveElement: function (t) {
    this.destroySelectionBox(t)
    this.updateSelectionWrapper()
  },
  onResetElements: function (t) {
    this.destroyAllSelectionBoxes()
    t.each(this.createSelectionBox, this)
    this.updateSelectionWrapper()
  },
  onAddElement: function (t) {
    this.createSelectionBox(t)
    this.updateSelectionWrapper()
  },
  removeElements: function (t) {
    var e = this.collection.toArray()
    this.cancelSelection()
    this.options.graph.removeCells(e, {
      selection: this.cid,
    })
  },
  startRotating: function (t) {
    this.options.graph.trigger('batch:start')
    var e = this.options.graph.getBBox(this.model.models).center()
    var i = this.options.paper.snapToGrid({
      x: t.clientX,
      y: t.clientY,
    })
    var s = util.transform(this.model.toArray(), function (t, e) {
      t[e.id] = g.normalizeAngle(e.get('angle') || 0)
    })
    this._rotation = {
      center: e,
      clientAngle: g.point(i).theta(e),
      initialAngles: s,
    }
  },
  startResizing: function (t) {
    var e = this.options.paper
    var i = this.options.graph
    var s = e.options.gridSize
    var o = this.model.toArray()
    var a = i.getBBox(o)
    var r = util.invoke(o, 'getBBox')
    var l = util.min(r, 'width').width
    var c = util.min(r, 'height').height
    this._resize = {
      cells: i.getSubgraph(o),
      bbox: a,
      minWidth: s * a.width / l,
      minHeight: s * a.height / c,
    }
    i.trigger('batch:start')
  },
  doResize: function (t, e, i) {
    var n = this._resize
    var s = n.bbox
    var o = s.width
    var a = s.height
    var r = Math.max(o + e, n.minWidth)
    var l = Math.max(a + i, n.minHeight)

    if (Math.abs(o - r) > 0.001 || Math.abs(a - l) > 0.001) {
      this.options.graph.resizeCells(r, l, n.cells, {
        selection: this.cid,
      })
      s.width = r
      s.height = l
      this.updateSelectionBoxes()
    }
  },
  doRotate: function (t) {
    var e = this._rotation
    var i = this.options.rotateAngleGrid
    var n = this.options.paper.snapToGrid({
      x: t.clientX,
      y: t.clientY,
    })
    var s = e.clientAngle - g.point(n).theta(e.center)
    if (Math.abs(s) > 0.001) {
      this.model.each(function (t) {
        var n = g.snapToGrid(e.initialAngles[t.id] + s, i)
        t.rotate(n, !0, e.center, {
          selection: this.cid,
        })
      }, this)
      this.updateSelectionBoxes()
    }
  },
  stopBatch: function () {
    this.options.graph.trigger('batch:stop')
  },
  getAction: function () {
    return this._action
  },
}, {
  depthComparator: function (t) {
    return t.getAncestors().length
  },
})
