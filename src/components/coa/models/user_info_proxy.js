/* eslint comma-dangle: ["error", "always-multiline"] */

import _backbone from 'backbone'

_backbone.Model.extend({
  url: '/rest/user_info',
  defaults: {
    users: [],
    roles: [],
  },
  initialize: function () {
    this.on('sync', this.onSync, this)
  },
  onSync: function () {
    this.users.reset(this.get('users'))
    this.roles.reset(this.get('roles'))
  },
})
