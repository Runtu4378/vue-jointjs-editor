const express = require('express')
const cors = require('cors')
const path = require('path')

const dbInit = require('./lib/dbInit.js')
const respWrapper = require('./lib/resp.js')

const app = express()
const port = 3000

app.use(cors())
app.use(
  '/api/static',
  express.static(path.join(__dirname, 'static'))
)

// 获取剧本列表
app.get('/api/playbook', (req, res) => {
  const playbookList = req.app.lowdb.get('playbook').value()

  res.send(respWrapper(null, playbookList))
})

// 获取app列表
app.get('/api/playbook/menu/app', (req, res) => {
  const playbookList = req.app.lowdb.get('app').value()

  res.send(respWrapper(null, playbookList))
})

// 获取action哈希表
app.get('/api/playbook/menu/action', (req, res) => {
  const playbookList = req.app.lowdb.get('action').value()

  res.send(respWrapper(null, playbookList))
})

// 获取artifacts哈希表
app.get('/api/dataconfig/artifacts', (req, res) => {
  const playbookList = req.app.lowdb.get('artifacts').value()

  res.send(respWrapper(null, playbookList))
})

// 获取template哈希表
app.get('/api/playbook/template', (req, res) => {
  const playbookList = req.app.lowdb.get('template').value()

  res.send(respWrapper(null, playbookList))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)

  const lowdb = dbInit()
  app.lowdb = lowdb
})
