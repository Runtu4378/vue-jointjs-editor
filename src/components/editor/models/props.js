/* eslint comma-dangle: ["error", "always-multiline"] */

import {
  Model,
} from 'backbone'

export default Model.extend({
  /** 栅格大小 */
  gridSize: 20,
  /** 组件前缀 */
  prefix: 'cmChart',

  /** 图片前缀 */
  imgPrefix: '/joi/img',

  /** header相关设置 */
  headerHeight: 28,
  headerIconPadding: 12,
  headerFontSize: 12,
  headerBgColor: '#161B1E',

  /** 端点配置 */
  portBgColor: '#51B252',
})
