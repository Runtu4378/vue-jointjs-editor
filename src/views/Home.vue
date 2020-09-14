<template>
  <div class="home">
    <a-button
      style="margin-bottom: 16px"
      type="primary"
      @click="_handleCreate"
    >
      新建playbook
    </a-button>
    <a-table
      rowKey="id"
      :columns="columns"
      :data-source="data"
      :pagination="false"
    >
      <span slot="action" slot-scope="id, name">
        <a @click="_handleEdit(id, name)">编辑</a>
      </span>
    </a-table>

    <Editor ref="editor" />
  </div>
</template>

<script>
import Editor from './Editor'

import net from '../lib/api.js'

export default {
  components: {
    Editor
  },

  data () {
    return {
      columns: [
        {
          title: '名称',
          key: 'name',
          dataIndex: 'name'
        },
        {
          title: '描述',
          key: 'description',
          dataIndex: 'description'
        }
        // {
        //   title: '操作',
        //   key: 'action',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],

      data: []
    }
  },

  mounted () {
    this.initData()
  },

  methods: {
    async initData () {
      const { success, data, message } = await net({
        method: 'GET',
        url: '/playbook'
      })
      if (!success) {
        this.$message.error(message)
      } else {
        this.data = data
      }
    },

    _handleCreate () {
      this.$refs['editor'].handleCreate()
    },
    _handleEdit (id, name) {
      // 跳转到编辑器
      this.$refs['editor'].handleEdit(id, name)
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
  padding: 16px 28px;
}
</style>
