// 全局配置文件

export default {
  // 各节点id
  layouts: {
    headerId: 'cmc_editor_header',
    rightPanelId: 'cmc_editor_rightPanel',
    stageContainerId: 'cmc_editor_stageContainer',
    stageId: 'cmc_editor_stage',
    panelId: 'cmc_editor_panel',
    paperId: 'cmc_editor_paper',
    framesId: 'cmc_editor_frames',
    editorId: 'cmc_editor_editor',
    debuggerId: 'cmc_editor_debugger',
    settingsId: 'cmc_editor_settings',
    notificationsId: 'cmc_editor_notifications',
    loaderId: 'cmc_editor_loader',
  },

  /** 栅格大小 */
  gridSize: 20,
  /** 图片前缀 */
  staticPrefix: '/static/coa/img',
  /** header相关设置 */
  headerHeight: 28,
  headerIconPadding: 12,
  headerFontSize: 12,

  colors: {
    header: '#333',
    background: '#fff',
    border: '#333',
  },

  /** 端点配置 */
  portBgColor: '#409EFF',
}
