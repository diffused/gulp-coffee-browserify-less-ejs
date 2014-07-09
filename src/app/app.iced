express = require('express')
livereload = require('connect-livereload')


EXPRESS_PORT = 4000;
PUBLIC_ROOT = './app/public/';
LIVERELOAD_PORT = 35729;


console.log 'starting dev yo...'

app = express()
# console.log(app.env)

app.use(livereload({port: LIVERELOAD_PORT} ) )
app.use(express.static(PUBLIC_ROOT))


# app.configure 'development', ->
#   console.log('using development')
#   app.use express.errorHandler(
#     dumpExceptions: true
#     showStack: true
#   )



app.get '/blah', (req, res) ->
  res.send 'blah!'




app.listen(EXPRESS_PORT)

