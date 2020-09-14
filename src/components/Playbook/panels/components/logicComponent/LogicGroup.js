/**这个js是放 逻辑块组的 */

import condition from './condition' //i
//import container from 'container'
// const tempalte = `
//     <div class="group-name">
//     <div class="circle output-<%= position %>"></div>
//     Condition <%= position %></div>
//     <div class="logic-select"></div>
//     <div class="clear"></div>
//     <div class="logic-type"></div>
//     <div class="conditions"></div>
//     <div class="clear"></div>`

const tempalte = `<div class="group-name">  
    <div class="circle output-<%= position %>"></div>  
    <%= display %>
    </div>
    <div class="logic-select"></div>
    <div class="clear"></div>
    <div class="logic-type"></div>
    <div class="conditions"></div>
    <div class="clear"></div>`

export default Backbone.View.extend({
    className: "logic-group",
    events: {
        "click .fa-plus": "addCondition"
    },
    initialize: function (t) {
        this.template = _.template(tempalte),
            this.index = t.index + 1,
            this.listenTo(this.dispatcher, "logic:delete", this.removeCondition),
            this.listenTo(this.model, "change:logic", this.updateCode),
            this.conditionViews = []
    },
    remove: function () {
        _.invoke(this.conditionViews, "remove"),
            this.conditionViews = [],
            this.logicMenu && this.logicMenu.remove(),
            Backbone.View.prototype.remove.apply(this)
    },
    render: function () {
        var that = this;
        this.$el.html(this.template(_.extend(this.model.toJSON(), {
            position: this.index,
        })));
        var e = 1 == this.index && 1 == this.model.conditions.length ? false : true,
            n = this.$el.find(".conditions");
        return _.each(this.model.conditions.models, function (s, o, a) {
            var r = o == a.length - 1 ? !0 : !1,
                l = new condition({
                    model: s,
                    can_delete: e,
                    can_add: r,
                    type: that.model.get("type"),
                    logic: that.model.get("logic"),
                    index: o,
                    output: that.model
                });
            n.append(l.render().el), that.conditionViews.push(l)
        }), this.$el.addClass(this.model.get("type")), this
    },
    addCondition: function () {
        this.model.addCondition(), this.model.collection.trigger("add"), this.dispatcher.trigger("code:update")
    },
    removeCondition: function (t) {
        this.model.conditions.get({
            cid: t.cid
        }) && (this.model.removeCondition(t),
            0 === this.model.conditions.length ? this.blocks.getActive().removeOutput(this.model, this.index) : (1 === this.model.conditions.length && this.model.set("logic", "and"),
                this.model.collection.trigger("remove"))), this.dispatcher.trigger("code:update")
    },
    updateCode: function (t, e) {
        this.dispatcher.trigger("code:update")
    }
})