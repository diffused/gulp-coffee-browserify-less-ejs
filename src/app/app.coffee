express = require('express')
livereload = require('connect-livereload')

# lrserver.listen(LIVERELOAD_PORT);

EXPRESS_PORT = 4000;
EXPRESS_ROOT = './app/public/';
# LIVERELOAD_PORT = 35729;


console.log 'starting dev yo...'

app = express()
# console.log(app.env)

app.use(express.static(EXPRESS_ROOT))

# app.configure 'development', ->
#   console.log('using development')
#   app.use express.errorHandler(
#     dumpExceptions: true
#     showStack: true
#   )


# app.use(livereload({port: LIVERELOAD_PORT}));
# app.use(express.static(EXPRESS_ROOT));
app.get '/blah', (req, res) ->
  res.send 'blah 7!!!'

console.log 'yoyo'


app.listen(4000)

