
'use strict'

const express = require('express')
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')
const config = require('./config')
const Notifier = require('./../tasks/notify.js')

let app = express()
let notifier = new Notifier

if (config('PROXY_URI')) {
  app.use(proxy(config('PROXY_URI'), {
    forwardPath: (req, res) => { return require('url').parse(req.url).path }
  }))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => { res.send('\n Hello \n') })

app.post('/', (req, res) => { 
  //console.log(`Request received:\n`+JSON.stringify(req.body))
  console.log(`Request received`)

  notifier.parseRequest(req.body)

  res.send('') 
})

app.listen(config('PORT'), (err) => {
  if (err) throw err

  console.log(`\n Jirabot LIVES on PORT ${config('PORT')}`)
})
