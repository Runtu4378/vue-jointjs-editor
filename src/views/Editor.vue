<template>
  <div class="editor">
    <Editor />
  </div>
</template>

<script>
// @ is an alias to /src
import Editor from '@/components/Editor.vue'

export default {
  name: 'home',
  components: {
    Editor
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
