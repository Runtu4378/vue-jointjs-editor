const fs = require('fs-extra')
const path = require('path')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const DB_FILE = path.resolve(__dirname, '../db/db.json')

module.exports = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, '{}')
  }

  const adapter = new FileSync(DB_FILE)
  const db = low(adapter)

  // 设置默认数据结构 (如果你的 JSON 文件为空)
  // 推荐设置，不设置的话如果是新的 json 文件,或者变更了结构,会报错
  db.defaults({
    playbook: [
      {
        id: 290,
        name: 'test_001',
        description: '[请不要删除，谢谢]默认剧本4-基于XXX事件中的目标IP进行威胁行为分析',
        status: 0,
        version: '1.0.1',
        create_time: '2019-10-22T16:53:58.224767',
        update_time: '2019-10-22T17:54:02.501712'
      }
    ]
  }).write()

  return db
}
