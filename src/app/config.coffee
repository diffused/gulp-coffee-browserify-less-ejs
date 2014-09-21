express = require('express')
livereload = require('connect-livereload')
path = require("path")

configureApp = (app) ->
  app.use(livereload({port: app.get('LIVERELOAD_PORT')}))
  app.use(express.static(app.get('PUBLIC_ROOT')))

  app.set "view engine", "ejs"
  # app.set "template engine", "ejs"
  app.set "views", path.join(__dirname, "views")

  # setup middleware
  # https://github.com/senchalabs/connect#middleware.
  
  # app.use express.logger("dev")

  bodyParser = require 'body-parser'
  app.use bodyParser.urlencoded({ extended: false })
  app.use bodyParser.json()

  # app.use express.methodOverride()

  cookieParser = require 'cookie-parser'
  app.use cookieParser("kkkjkj$J%j5k4kj4kj4kj45k5k4k4488f8fe")

  session = require('cookie-session')
  app.use(session({
    keys: ['key1', 'key2']
    # secureProxy: true # if you do SSL outside of node
  }))

module.exports = configureApp