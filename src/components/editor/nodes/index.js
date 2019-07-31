/* eslint comma-dangle: ["error", "always-multiline"] */

import * as joint from 'jointjs'

import props from '../props.js'

import {
  StartEndModel,
  StartEndView,
} from './StartEnd.js'

/** 初始化自动自组件 */
export default () => {
  joint.shapes[props.prefix] = {}
  joint.shapes[props.prefix].StartEnd = StartEndModel
  joint.shapes[props.prefix].StartEndView = StartEndView
}
