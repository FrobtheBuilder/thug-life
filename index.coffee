express = require 'express'
app = express()

app.use (require "connect-assets")()
app.use express.static(__dirname + '/public')
app.set "views", "#{__dirname}/views/"

app.get '/', (req, res) ->
  res.render 'index.jade'

app.listen 3000