<template>
  <div class="editor">
    <a-drawer
      ref="dialog"
      :title="title"
      :visible="dialogVisible"
      height="100%"
      width="100%"
      placement="bottom"
      @close="handleClose"
    >
      <div id="editor_main"></div>
    </a-drawer>
  </div>
</template>

<script>
// @ is an alias to /src
import Playbook from '@/components/Playbook/index.js'

export default {
  coa: null,

  data () {
    return {
      title: '',
      dialogVisible: false,
      pid: '',
      mode: ''
    }
  },

  methods: {
    handleCreate () {
      this.title = '新建playbook'
      this.mode = 'edit'
      this.pid = ''
      this._show()
    },
    handleEdit (pid, title) {
      this.title = title
      this.mode = 'edit'
      this.pid = pid
      this._show()
    },
    handleView (pid, title) {
      this.title = title
      this.mode = 'view'
      this.pid = pid
      this._show()
    },
    handleClose () {
      if (this.coa) {
        this.coa.destory()
        this.coa = null
      }
      this.dialogVisible = false
      const dom = this.$refs['dialog'].$el
      // console.log(dom)
      dom && dom.parentNode.removeChild(dom)
    },

    _show () {
      this.dialogVisible = true
      this.$nextTick(() => {
        this._initPlaybook()
      })
    },
    _initPlaybook () {
      this.coa = new Playbook({
        id: 'editor_main',
        mode: this.mode,
        pid: this.pid,
        onClose: () => {
          this.dialogVisible = false
        }
      })
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
  width: 100%;
}
#app {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>

<style lang="scss" scoped>
.home {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
