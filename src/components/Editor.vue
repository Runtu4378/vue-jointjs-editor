<template>
  <div class="editor-wrapper">
    <div id="canvas" class="canvas"></div>
  </div>
</template>

<script>
/* globals $ */
import PlayBook from './Playbook/index.js'

export default {
  editor: null,

  data () {
    return {}
  },

  mounted () {
    $(function () {
      /* eslint-disable-next-line */
      new PlayBook({
        id: 'canvas'
      })
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
