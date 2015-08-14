express = require 'express'
assets = require 'connect-assets'
config = require './config.json'

app = express()

app.use assets()
app.use express.static(__dirname + '/public')
app.set "views", "#{__dirname}/views/"

app.use (req, res, next) ->
  console.log
    method: req.method
    url: req.url
    params: req.params
    query: req.query

  return next()

app.get '/', (req, res) ->
  res.render 'index.jade'

app.listen config.port