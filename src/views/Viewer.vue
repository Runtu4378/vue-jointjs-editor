<template>
  <div class="wrapper">
    <div id="paper"></div>
  </div>
</template>

<script>
import Viewer from '../components/editor/viewer/index.js'

export default {
  data () {
    return {}
  },

  mounted () {
    /* eslint-disable-next-line */
    new Viewer({
      id: 'paper'
    })
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
  width: 100%;
  height: 100%;
}
</style>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
