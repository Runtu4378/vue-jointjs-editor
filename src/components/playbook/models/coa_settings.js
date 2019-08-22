/* eslint comma-dangle: ["error", "always-multiline"] */

import _bb from 'backbone'

export default _bb.Model.extend({
  initialize: function () {
    this.lightBlockColors = {
      header: '#171D21',
      background: '#FFFFFF',
      border: '#818D99',
    }
    this.darkBlockColors = {
      header: '#3C444D',
      background: '#000000',
      border: '#5C6773',
    }
    this.smallBlockIcons = {
      api: 'block_icon_api.svg',
      contain: 'block_icon_contain.svg',
      correct: 'block_icon_correct.svg',
      investigate: 'block_icon_investigate.svg',
      playbook: 'block_icon_playbook.svg',
      generic: 'block_icon_generic.svg',
    }
    this.strokeColors = {
      active: '#0083FF',
      warn: '#E6984E',
      error: '#A30014',
    }
    this.messageColors = {
      active: '#007ABD',
      warn: '#F8BE34',
      error: '#DC4E41',
    }
    this.promptResponseTypes = {
      Message: {
        label: 'Message',
        type: 'message',
        locked: !0,
        options: ['', ''],
      },
      'Yes/No': {
        label: 'Yes/No',
        type: 'list',
        locked: !0,
        options: ['Yes', 'No'],
      },
      '1-100': {
        label: '1-100',
        type: 'range',
        locked: !0,
        options: [1, 100],
      },
      'Custom List': {
        label: 'Custom List',
        type: 'list',
        locked: !1,
        options: ['', ''],
      },
      'Custom Range': {
        label: 'Custom Range',
        type: 'range',
        locked: !1,
        options: [1, 10],
      },
    }
    this.brandColor = '#5CC05C'
  },
  getBlockIcon: function (t) {
    return this.smallBlockIcons.hasOwnProperty(t) ? this.smallBlockIcons[t] : this.smallBlockIcons.generic
  },
  getBlockHeaderColor: function () {
    return window.PHANTOM_THEME === 'dark' ? this.darkBlockColors.header : this.lightBlockColors.header
  },
  getBlockBackgroundColor: function () {
    return window.PHANTOM_THEME === 'dark' ? this.darkBlockColors.background : this.lightBlockColors.background
  },
  getBlockBorderColor: function () {
    return window.PHANTOM_THEME === 'dark' ? this.darkBlockColors.border : this.lightBlockColors.border
  },
})
