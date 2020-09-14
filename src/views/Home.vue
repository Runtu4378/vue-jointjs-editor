<template>
  <div class="home">
    <a-table :columns="columns" :data-source="data">
      //
    </a-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns: [
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '状态',
          key: 'age'
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],

      data: []
    }
  },

  methods: {}
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
  padding: 16px 28px;
}
</style>
