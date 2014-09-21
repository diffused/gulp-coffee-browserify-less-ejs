express = require('express')
path = require("path")
i = require('eyes').inspector({styles: {all: 'magenta'}})

EXPRESS_PORT = 4000
PUBLIC_ROOT = './app/public/'
LIVERELOAD_PORT = 35729


console.log "starting app server on localhost:#{EXPRESS_PORT}"

app = express()
app.set 'EXPRESS_PORT', EXPRESS_PORT
app.set 'PUBLIC_ROOT', PUBLIC_ROOT
app.set 'LIVERELOAD_PORT', LIVERELOAD_PORT

require('./config')(app)


# env = process.env.NODE_ENV || 'development'
# if 'development' == env
  # errorhandler = require('errorhandler')
  # app.use errorhandler(
  #   dumpExceptions: true
  #   showStack: true
  # )

loadRoutes = () ->
  routesPath = path.join(__dirname, 'routes')
  require("fs").readdirSync(routesPath).forEach (file) ->
    f = path.join(routesPath, file)
    require(f)({app: app})

loadRoutes()

app.get '/', (req, res) ->
  res.render 'index',
    title: 'Index!'
    someValue: 'some value here'

app.get '/blah', (req, res) ->
  res.send 'blah! 2'

app.get '/hello', (req, res) ->
  res.render 'hello',
    title: 'title hi'




app.listen(EXPRESS_PORT)