/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'
import _ from 'underscore'

import editMode from '../mixins/edit_mode'

const template = `<i class="fa fa-search"></i>
<input type="text" class="search" placeholder="<%= placeholder %>">
`

export default _bb.View.extend(_.extend({}, editMode, {
  className: 'search-input-widget',
  initialize: function (t) {
    this.placeholder = t.placeholder
    this.search = t.search
    this.template = _.template(template)
    this.initEditMode()
  },
  render: function () {
    this.$el.html(this.template({
      placeholder: this.placeholder,
    }))
    this.$el.find('input').val(this.search)
    this.setEditMode()
    return this
  },
}))
