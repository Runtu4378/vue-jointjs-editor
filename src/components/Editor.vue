<template>
  <div class="editor-wrapper">
    <div id="canvas" class="canvas"></div>
  </div>
</template>

<script>
// import Editor from './editor/index.js'
import PlayBook from './playbook/index.js'

export default {
  editor: null,

  data () {
    return {}
  },

  mounted () {
    this.editor = new PlayBook({
      id: 'canvas'
    })
  }
}
</script>

<style lang="scss" scoped>
.editor-wrapper {
  position: relative;
  height: 100%;
  width: 100%;

  .canvas {
    height: 100%;
    width: 100%;
  }
}
</style>
