import config from '../config'
import {
	Model,
	View,
} from './Base.js' //n

// import CollectionAssets from '../collections/asset_configs'
import CollectionOutputs from '../collections/Outputs' //o
import Output from '../models/Output' // s

export const DecisionModel = Model.extend(_.extend({}, {
	markup: `<g class='rotatable'>  
	<g class='inPorts'/><g class='outPorts'/>  
	<g class='scalable'></g>  
	<rect class='background'></rect>  
	<text class='number'/>
	<g class='icon'><image/></g> 
	<g class='error'><image/></g>
	<g class='notes'><image/></g>
	<g class='btn delete'><image/><title>Delete decision</title></g>
	</g>
`,
	defaults: _.defaultsDeep({
		type: 'coa.Decision',
		state: 'decision',
		name: 'decision',
		hasElse: false,
		size: {
			width: 82,
			height: 82
		},
		inPorts: ['in'],
		outPorts: ['out-1'],
		attrs: {
			'.': {
				magnet: false
			},
			'.port-body': {
				r: 8,
				magnet: true
			},
			'.background': {
				'fill-opacity': 1,
				'stroke-width': 2,
				width: 60,
				height: 60,
				y: 10,
				x: -14,
				rx: 5,
				ry: 5,
				filter: {
					name: 'dropShadow',
					args: {
						dx: 2,
						dy: 2,
						blur: 2,
						opacity: .3
					}
				}
			},
			'g.error image': {
				'xlink:href': '',
				x: 58,
				y: 31,
				width: 16,
				height: 13
			},
			'text.number': {
				'font-size': 11,
				'font-family': 'Roboto',
				'font-weight': 600,
				text: '',
				'ref-y': 58,
				'ref-x': 42,
				'text-anchor': 'middle'
			},
			'g.icon image': {
				'xlink:href': `${config.staticPrefix}/block_icon_decision.svg`,
				y: 29,
				x: 32,
				width: 21,
				height: 23
			},
			'g.delete image': {
				'xlink:href': `${config.staticPrefix}/block_delete.svg`,
				x: 50,
				y: 0,
				width: 26,
				height: 26,
				opacity: .8
			},
			'g.notes image': {
				'xlink:href': `${config.staticPrefix}/block_icon_note_light_off.svg`,
				y: 32,
				x: 14,
				width: 12,
				height: 14
			},
			'.port-body circle': {
				magnet: true
			},
			'.inPorts circle': {
				type: 'input',
				'ref-x': 0,
				'ref-y': 39
			},
			'.outPorts circle': {
				type: 'output'
			}
		},
	}, Model.prototype.defaults),
	initialize: function () {
		Model.prototype.initialize.apply(this, arguments),
			this.outputs = new CollectionOutputs([new Output]),
			this.on('change:number', function (t, e) {
				t.attr('.number/text', e)
			}),
			this.on('change:custom_code', function (t, e) {
				this.set('warn', false)
			}),
			this.on('change:active', function (t, e) {
				if (e) {
					this.set('status', 'active')
				} else {
					if (this.errors > 0) {
						this.set('status', 'error')
					} else {
						if (this.warnings.length > 0) {
							this.set('status', 'warn')
						} else {
							this.set('status', '')
						}
					}
				}
			}),
			this.on('change:status', function (t, e) {
				var i = '#637282',
					n = this.errors > 0 ? true : false,
					s = this.warnings.length > 0 ? true : false;
				'active' === e ? i = this.coaSettings.strokeColors[e] : n ? (
					i = this.coaSettings.strokeColors.error, e = 'error'
				) : s && (
					i = this.coaSettings.strokeColors.warn, e = 'warn'
				),
					'warn' === e || 'error' == e ? (t.attr('g.error/opacity', 1),
						t.attr({
							'g.error image': {
								'xlink:href': `${config.staticPrefix}/block_icon_warn.svg`,
							}
						})) : t.attr('g.error/opacity', 0), t.attr('.background/stroke', i)
			}), this.on('change:notes', function (t, e) {
				'' === e ? t.attr({
					'g.notes image': {
						'xlink:href': `${config.staticPrefix}/block_icon_note_light_off.svg`,
						opacity: 1
					}
				}) : t.attr({
					'g.notes image': {
						'xlink:href': `${config.staticPrefix}/block_icon_note_light_on.svg`,
						opacity: 1
					}
				})
			}),
			this.set('name', 'decision'),
			this.attr('.background/transform', 'rotate(45 30 70)'),
			this.attr('.background/fill',
				this.coaSettings.getBlockBackgroundColor()),
			this.attr('.background/stroke',
				this.coaSettings.getBlockBorderColor())
	},
	updateParamNames: function (t, e) {
		_.each(this.outputs.models, function (i, n) {
			_.each(i.conditions.models, function (i, n) {
				var value = i.get('value'),
					param = i.get('param');
				_.each(t, function (t) {
					return s.match(t) ? (value = value.replace(t, '$1' + e + '$3'), i.set('value', value), false) : void 0
				}), _.each(t, function (t) {
					return param.match(t) ? (param = param.replace(t, '$1' + e + '$3'), i.set('param', param), false) : void 0
				})
			})
		})
	},
	updateOutputVarNames: function (t, e) {
		_.each(this.outputs.models, function (i, n) {
			_.each(i.conditions.models, function (i, n) {
				var value = i.get('value'),
					param = i.get('param');
				_.each(t, function (t) {
					return value.match(t) ? (value = value.replace(t, '$1$2' + e), i.set('value', value), false) : void 0
				}), _.each(t, function (t) {
					return param.match(t) ? (param = param.replace(t, '$1$2' + e), i.set('param', param), false) : void 0
				})
			})
		})
	},
	addOutput: function (t, e) {
		var outPorts = this.get('outPorts');
		this.set('outPorts', outPorts.concat(['out-' + (outPorts.length + 1)]), e);
		var n = this.get('hasElse') ? this.outputs.length - 1 : this.outputs.length;
		'else' === t ? (this.set('hasElse', true), this.outputs.add(new Output({
			type: t,
			display: 'Else'
		}))) : this.outputs.add(new Output({
			type: t,
			display: 'Else If'
		}), {
				at: n
			}),
			this.updateDeletePosition(),
			this.dispatcher.trigger('update:code'),
			this.markCodeChange()
	},
	removeOutput: function (t, e, i) {
		var n = this.graph.getConnectedLinks(this, {
			outbound: true
		});
		'else' === t.get('type') && this.set('hasElse', false), _.each(n, function (t) {
			var i = t.get('source'),
				n = i.port.substring(4);
			n > e ? (i.port = 'out-' + (n - 1),
				i.selector = 'g:nth-child(1) > g:nth-child(2) > g:nth-child(' + (e - 1) + ') > circle:nth-child(1)',
				t.set('source', i)) : n == e && t.remove()
		}),
			this.get('outPorts').splice(-1),
			this.updateDeletePosition(),
			this.outputs.remove(t),
			this.outputs.trigger('remove'),
			this.trigger('change:outPorts'),
			this.dispatcher.trigger('block:update', this),
			this.dispatcher.trigger('update:code'),
			this.markCodeChange()
	},
	getPortAttrs: function (t, e, i, n, s) {
		var o = {},
			a = 'port-' + e,
			r = n + '>.' + a,
			l = r + '>.port-body';
		if (o[l] = {
			port: {
				id: t,
				type: s
			}
		}, 'out' === s) switch (e) {
			case 0:
				o[r] = {
					port: {
						id: t,
						type: s
					},
					'ref-x': 83,
					'ref-y': 40
				};
				break;
			case 1:
				o[r] = {
					port: {
						id: t,
						type: s
					},
					'ref-x': 41,
					'ref-y': 82
				};
				break;
			case 2:
				o[r] = {
					port: {
						id: t,
						type: s
					},
					'ref-x': 41,
					'ref-y': -2
				};
				break;
			case 3:
				o[r] = {
					port: {
						id: t,
						type: s
					},
					'ref-x': 67,
					'ref-y': 16
				};
				break;
			case 4:
				o[r] = {
					port: {
						id: t,
						type: s
					},
					'ref-x': 67,
					'ref-y': 63
				}
		}
		return o
	},
	validateConfig: function (t, e, i, n) {
		var that = this;
		this.get('has_custom_block') || _.each(this.outputs.models, function (t, o) {
			_.each(t.conditions.models, function (a, r) {
				const l = a.get('value'),
					c = a.get('param');
				l && !s._checkConfigValue(l, e, i, n) && (s.warnings.push('Invalid data path on condition ' + (o + 1)),
					that.field_warnings.push(l)),
					c && !s._checkConfigValue(c, e, i, n) && (s.warnings.push('Invalid data path on condition ' + (o + 1)),
						that.field_warnings.push(c)), '' === l && '' === c && 'else' !== t.get('type')
					&&
					that.warnings.push('No parameters configured on condition ' + (o + 1))
			})
		})
	},
	updateDeletePosition: function () {
		var t = this.get('outPorts').length < 4 ? 50 : 5;
		this.attr({
			'g.delete image': {
				x: t
			}
		})
	},
	updatePromptParamValues: function (t) {
		var e = t + ':action_result.summary.response';
		_.each(this.outputs.models, function (t, i) {
			_.each(t.conditions.models, function (t, i) {
				var n = t.get('param');
				if (n === e) {
					var s = e.replace('response', 'responses.0');
					t.set('param', s)
				}
			})
		})
	},
	toJSON: function () {
		var t = DecisionModel.__super__.toJSON.apply(this);
		return t.outputs = this.outputs.toJSON(), t
	},
	conversion35: function () {
		this.attr({
			'g.icon image': {
				'xlink:href': `${config.staticPrefix}/block_icon_decision.svg`,
				x: 32,
				y: 29,
				width: 21,
				height: 23,
			}
		})
	}
}))

export const DecisionView = View.extend({
	extraEvents: {
		'mouseenter .icon': 'showTooltip',
		'mouseleave .icon': 'hideTooltip',
		'click .icon': 'hideTooltip'
	},
	initialize: function () {
		View.prototype.initialize.apply(this, arguments),
			this.deleteTitle = 'Delete decision block?',
			this.deleteMessage = 'This will remove the decision block and any configuration.',
			this.listenTo(this.model, 'change:active', this.updateState)
	},
	events: function () {
		return _.extend({}, this.baseEvents, this.extraEvents)
	}
})