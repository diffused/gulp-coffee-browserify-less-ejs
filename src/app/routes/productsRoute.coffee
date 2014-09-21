productsRoute = (params) ->
  @app = params.app

  @app.get '/products', (req, res) ->
    res.send 'products route index 2'

  # index: (req, res) ->
  #   res.send 'products route index 3'

module.exports = productsRoute