/**这是放header块的 */


const template =`<div class="connection">Connected <%- type %>: <%- name %></div>`

export default Backbone.View.extend({
    className: "connection-summary",
    initialize: function () {
      this.template = _.template(template)
    },
    render: function () {
      var t = this.blocks.getActive(),
        e = t.get("connection_type"),
        i = t.get("connection_name");
      return e && i && this.$el.html(this.template({
        type: e,
        name: i
      })), this
    }
  });

