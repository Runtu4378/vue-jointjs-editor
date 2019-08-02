/* eslint comma-dangle: ["error", "always-multiline"] */

import * as joint from 'jointjs'

import defaultProps from '../defaultProps'

import {
  StartEndModel,
  StartEndView,
} from './StartEnd.js'
import {
  ActionModel,
  ActionView,
} from './Action.js'

/** 初始化自动自组件 */
export default () => {
  joint.shapes[defaultProps.prefix] = {}
  joint.shapes[defaultProps.prefix].StartEnd = StartEndModel
  joint.shapes[defaultProps.prefix].StartEndView = StartEndView
  joint.shapes[defaultProps.prefix].Action = ActionModel
  joint.shapes[defaultProps.prefix].ActionView = ActionView
}
