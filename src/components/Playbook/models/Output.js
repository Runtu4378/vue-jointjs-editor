import ModelCondition from './Condition' // i
import CollectionConditions from '../collections/Conditions' // n

const output = Backbone.Model.extend({
  defaults: {
    type: 'if',
    display: 'If',
    logic: 'and'
  },
  initialize: function (t, e) {
    var s = this
    this.conditions = new CollectionConditions(), t && t.conditions ? _.each(t.conditions, function (t) {
      s.conditions.add(t)
    }) : this.conditions.add(new ModelCondition())
  },
  toJSON: function () {
    var t = output.__super__.toJSON.apply(this)
    return t.conditions = _.invoke(this.conditions.models, 'toJSON'), t
  },
  addCondition: function (t) {
    this.conditions.add(new ModelCondition(t))
  },
  removeCondition: function (t) {
    this.conditions.remove(t), this.conditions.length === 0 && this.collection.remove(this)
  }
})
export default output
