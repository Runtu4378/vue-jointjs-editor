const express = require('express')
const cors = require('cors')

const dbInit = require('./lib/dbInit.js')
const respWrapper = require('./lib/resp.js')

const app = express()
const port = 3000

app.use(cors())

app.get('/api/playbook', (req, res) => {
  const playbookList = req.app.lowdb.get('playbook').value()

  res.send(respWrapper(null, playbookList))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)

  const lowdb = dbInit()
  app.lowdb = lowdb
})
