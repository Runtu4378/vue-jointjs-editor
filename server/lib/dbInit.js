const fs = require('fs-extra')
const path = require('path')

const DB_FILE = path.resolve(__dirname, '../db/db.json')

module.exports = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, '{}')
  }
}
