export default Backbone.View.extend({
  className: 'loader',
  initialize: function () {
  },
  render: function () {
    return this
  },

  /// ----以下是自定义方法---
  checkAssets: function () {
    this.initialize()
    this.checkAssetStatus()
  },
  checkAssetStatus: function () {
    // TODO 增加判断条件
    this.progress.remove()
  },
})
