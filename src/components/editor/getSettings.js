/* eslint comma-dangle: ["error", "always-multiline"] */
/* globals PLAYBOOK_THEME */

export const lightBlockColors = {
  header: '#171D21',
  background: '#FFFFFF',
  border: '#818D99',
}
export const darkBlockColors = {
  header: '#3C444D',
  background: '#000000',
  border: '#5C6773',
}
export const smallBlockIcons = {
  api: 'block_icon_api.svg',
  contain: 'block_icon_contain.svg',
  correct: 'block_icon_correct.svg',
  investigate: 'block_icon_investigate.svg',
  playbook: 'block_icon_playbook.svg',
  generic: 'block_icon_generic.svg',
}
export const strokeColors = {
  active: '#0083FF',
  warn: '#E6984E',
  error: '#A30014',
}
export const messageColors = {
  active: '#007ABD',
  warn: '#F8BE34',
  error: '#DC4E41',
}
export const promptResponseTypes = {
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
export const brandColor = '#5CC05C'

export const getBlockIcon = (t) => {
  return smallBlockIcons.hasOwnProperty(t)
    ? smallBlockIcons[t]
    : smallBlockIcons.generic
}
export const getBlockHeaderColor = () => {
  return PLAYBOOK_THEME === 'dark'
    ? darkBlockColors.header
    : lightBlockColors.header
}
export const getBlockBackgroundColor = () => {
  return PLAYBOOK_THEME === 'dark'
    ? darkBlockColors.background
    : lightBlockColors.background
}
export const getBlockBorderColor = () => {
  return PLAYBOOK_THEME === 'dark'
    ? darkBlockColors.border
    : lightBlockColors.border
}
