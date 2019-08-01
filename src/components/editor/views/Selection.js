/* eslint comma-dangle: ["error", "always-multiline"] */

import * as joint from 'jointjs'
import backbone from 'backbone'
import * as _un from 'underscore'
import * as _lo from 'lodash'
import jq from 'jquery'

joint.ui = {}
joint.ui.SelectionView = joint.ui.Selection = joint.mvc.View.extend({
  options: {
    paper: void 0,
    graph: void 0,
    boxContent: function (t) {
      return joint.util.template('<%= length %> elements selected.')({
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
    if (this.options.model) {
      this.options.collection = this.options.model
    }
    const collection = this.collection = this.options.collection || this.collection || new backbone.Collection()
    if (!collection.comparator) {
      collection.comparator = this.constructor.depthComparator
      collection.sort()
      this.model = collection
    }
    if (!this.options.paper) {
      throw new Error('Selection: paper required')
    }
    _un.defaults(this.options, {
      graph: this.options.paper.model,
    })
    _un.bindAll(this, 'startSelecting', 'stopSelecting', 'adjustSelection', 'pointerup')
    jq(document.body).on('mousemove.selection touchmove.selection', this.adjustSelection)
    jq(document).on('mouseup.selection touchend.selection', this.pointerup)
    const mapView = this.options.paper
    const data = this.options.graph
    this.listenTo(data, 'reset', this.cancelSelection)
    this.listenTo(mapView, 'scale translate', this.updateSelectionBoxes)
    this.listenTo(data, 'remove change', function (canCreateDiscussions, p) {
      if (p.selection !== this.cid) {
        this.updateSelectionBoxes()
      }
    })
    this.listenTo(collection, 'remove', this.onRemoveElement)
    this.listenTo(collection, 'reset', this.onResetElements)
    this.listenTo(collection, 'add', this.onAddElement)
    mapView.$el.append(this.$el)
    this._boxCount = 0
    this.$selectionWrapper = this.createSelectionWrapper()
    this.handles = []
    _un.each(this.options.handles, this.addHandle, this)
  },
  cancelSelection: function () {
    this.model.reset([], {
      ui: true,
    })
  },
  addHandle: function (options) {
    this.handles.push(options)
    var a = jq('<div/>', {
      'class': 'handle ' + (options.position || '') + ' ' + (options.name || ''),
      'data-action': options.name,
    })
    if (options.icon) {
      a.css('background-image', 'url(' + options.icon + ')')
    }
    a.html(options.content || '')
    joint.util.setAttributesBySelector(a, options.attrs)
    this.$selectionWrapper.append(a)
    _un.each(options.events, function (type, name) {
      if (_un.isString(type)) {
        this.on('action:' + options.name + ':' + name, this[type], this)
      } else {
        this.on('action:' + options.name + ':' + name, type)
      }
    }, this)
    return this
  },
  stopSelecting: function (evt) {
    switch (this._action) {
      case 'selecting':
        const offset = this.$el.offset()
        let x = this.$el.width()
        let y = this.$el.height()
        const paper = this.options.paper
        const pt = joint.VPrototype(paper.viewport).toLocalPoint(offset.left, offset.top)
        pt.x -= window.pageXOffset
        pt.y -= window.pageYOffset
        var controller = paper.scale()
        x = x / controller.sx
        y = y / controller.sy
        var label = joint.V.rect(pt.x, pt.y, x, y)
        var data = this.getElementsInSelectedArea(label)
        var filter = this.options.filter
        if (_un.isArray(filter)) {
          data = _un.reject(data, function (s) {
            return _un.contains(filter, s.model) || _un.contains(filter, s.model.get('type'))
          })
        } else {
          if (_un.isFunction(filter)) {
            data = _un.reject(data, function (options) {
              return filter(options.model)
            })
          }
        }
        this.model.reset(_un.pluck(data, 'model'), {
          ui: true,
        })
        break
      case 'translating':
        this.options.graph.stopBatch('selection-translate')
        this.notify('selection-box:pointerup', evt)
        break
      default:
        if (!this._action) {
          this.cancelSelection()
        }
    }
    /** @type {null} */
    this._action = null
  },
  removeHandle: function (id) {
    var index = _un.findIndex(this.handles, {
      name: id,
    })
    var options = this.handles[index]
    if (options) {
      _un.each(options.events, function (canCreateDiscussions, dep) {
        this.off('action:' + id + ':' + dep)
      }, this)
      this.$('.handle.' + id).remove()
      this.handles.splice(index, 1)
    }
    return this
  },
  startSelecting: function (evt) {
    evt = joint.util.normalizeEvent(evt)
    this.cancelSelection()
    let x
    let y
    const that = this.options.paper.el
    if (
      evt.offsetX != null &&
      evt.offsetY != null &&
      jq.contains(that, evt.target)
    ) {
      x = evt.offsetX
      y = evt.offsetY
    } else {
      const rct = jq(that).offset()
      const scrollLeft = that.scrollLeft
      const a = that.scrollTop
      x = evt.clientX - rct.left + window.pageXOffset + scrollLeft
      y = evt.clientY - rct.top + window.pageYOffset + a
    }
    this.$el.css({
      width: 1,
      height: 1,
      left: x,
      top: y,
    })
    this.showLasso()
    /** @type {string} */
    this._action = 'selecting'
    this._clientX = evt.clientX
    this._clientY = evt.clientY
    this._offsetX = x
    this._offsetY = y
  },
  changeHandle: function (prop, start) {
    var parent = _un.findWhere(this.handles, {
      name: prop,
    })
    if (parent) {
      this.removeHandle(prop)
      this.addHandle(_lo.merge({
        name: prop,
      }, parent, start))
    }
    return this
  },
  onSelectionBoxPointerDown: function (evt) {
    evt.stopPropagation()
    evt = joint.util.normalizeEvent(evt)
    if (this.options.allowTranslate) {
      this.startTranslatingSelection(evt)
    }
    this._activeElementView = this.getCellView(evt.target)
    this.notify('selection-box:pointerdown', evt)
  },
  startTranslatingSelection: function (evt) {
    /** @type {string} */
    this._action = 'translating'
    this.options.graph.startBatch('selection-translate')
    var snappedClientCoords = this.options.paper.snapToGrid({
      x: evt.clientX,
      y: evt.clientY,
    })
    this._snappedClientX = snappedClientCoords.x
    this._snappedClientY = snappedClientCoords.y
  },
  adjustSelection: function (evt) {
    evt = joint.util.normalizeEvent(evt)
    var dx
    var dy
    switch (this._action) {
      case 'selecting':
        dx = evt.clientX - this._clientX
        dy = evt.clientY - this._clientY
        var direction = parseInt(this.$el.css('left'), 10)
        var top = parseInt(this.$el.css('top'), 10)
        this.$el.css({
          left: dx < 0 ? this._offsetX + dx : direction,
          top: dy < 0 ? this._offsetY + dy : top,
          width: Math.abs(dx),
          height: Math.abs(dy),
        })
        break
      case 'translating':
        var snappedClientCoords = this.options.paper.snapToGrid({
          x: evt.clientX,
          y: evt.clientY,
        })
        var snappedClientX = snappedClientCoords.x
        var snappedClientY = snappedClientCoords.y

        dx = snappedClientX - this._snappedClientX
        dy = snappedClientY - this._snappedClientY
        if (dx || dy) {
          this.translateSelectedElements(dx, dy)
          if (this.boxesUpdated) {
            if (this.model.length > 1) {
              this.updateSelectionBoxes()
            }
          } else {
            var item = this.options.paper.scale()
            this.$el.children('.selection-box').add(this.$selectionWrapper).css({
              left: '+=' + dx * item.sx,
              top: '+=' + dy * item.sy,
            })
          }
          this._snappedClientX = snappedClientX
          this._snappedClientY = snappedClientY
        }
        this.notify('selection-box:pointermove', evt)
        break
      default:
        if (this._action) {
          this.pointermove(evt)
        }
    }
    this.boxesUpdated = false
  },
  translateSelectedElements: function (x, a) {
    var srcDestMap = {}
    this.model.each(function (model) {
      if (!srcDestMap[model.id]) {
        var result = {
          selection: this.cid,
        }
        model.translate(x, a, result)
        _un.each(model.getEmbeddedCells({
          deep: true,
        }), function (ch) {
          srcDestMap[ch.id] = true
        })
        var y = this.options.graph.getConnectedLinks(model)
        _un.each(y, function (item) {
          if (!srcDestMap[item.id]) {
            item.translate(x, a, result)
            srcDestMap[item.id] = true
          }
        })
      }
    }, this)
  },
  notify: function (setting, params) {
    var args = Array.prototype.slice.call(arguments, 1)
    this.trigger.apply(this, [setting, this._activeElementView].concat(args))
  },
  getElementsInSelectedArea: function (name) {
    var s = this.options.paper
    var opts = {
      strict: this.options.strictSelection,
    }
    if (this.options.useModelGeometry) {
      var text = s.model.findModelsInArea(name, opts)
      return _un.filter(_un.map(text, s.findViewByModel, s))
    }
    return s.findViewsInArea(name, opts)
  },
  pointerup: function (event) {
    if (this._action) {
      this.triggerAction(this._action, 'pointerup', event)
      this.stopSelecting(event)
      this._activeElementView = null
      this._action = null
    }
  },
  destroySelectionBox: function (element) {
    this.$('[data-model="' + element.get('id') + '"]').remove()
    if (this.$el.children('.selection-box').length === 0) {
      this.hide()
    }
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
      jq('<div/>').addClass('selection-box').attr('data-model', t.get('id')).css({
        left: i.x,
        top: i.y,
        width: i.width,
        height: i.height,
      }).appendTo(this.el)
      this.showSelected()
      this._boxCount++
    }
  },
  createSelectionWrapper: function () {
    var t = jq('<div/>', {
      'class': 'selection-wrapper',
    })
    var e = jq('<div/>', {
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
    if (_un.isFunction(this.options.boxContent)) {
      var i = this.$('.box')
      var s = this.options.boxContent.call(this, i[0])
      if (s) {
        i.html(s)
      }
    }
  },
  updateSelectionBoxes: function () {
    if (this._boxCount) {
      this.hide()
      _un.each(this.$el.children('.selection-box'), function (t) {
        var e = jq(t).remove().attr('data-model')
        var i = this.model.get(e)
        if (i) {
          this.createSelectionBox(i)
        }
      })
      this.updateSelectionWrapper()
      this.boxesUpdated = true
    }
  },
  onRemove: function () {
    jq(document.body).off('.selection', this.adjustSelection)
    jq(document).off('.selection', this.pointerup)
  },
  onHandlePointerDown: function (t) {
    this._action = jq(t.target).closest('.handle').attr('data-action')
    if (this._action) {
      t.preventDefault()
      t.stopPropagation()
      t = joint.util.normalizeEvent(t)
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
    var s = _un.transform(this.model.toArray(), function (t, e) {
      t[e.id] = joint.V.normalizeAngle(e.get('angle') || 0)
    })
    this._rotation = {
      center: e,
      clientAngle: joint.V.point(i).theta(e),
      initialAngles: s,
    }
  },
  startResizing: function (t) {
    var e = this.options.paper
    var i = this.options.graph
    var s = e.options.gridSize
    var o = this.model.toArray()
    var a = i.getBBox(o)
    var r = _un.invoke(o, 'getBBox')
    var l = _un.min(r, 'width').width
    var c = _un.min(r, 'height').height
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
    var s = e.clientAngle - joint.V.point(n).theta(e.center)
    if (Math.abs(s) > 0.001) {
      this.model.each(function (t) {
        var n = joint.V.snapToGrid(e.initialAngles[t.id] + s, i)
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
