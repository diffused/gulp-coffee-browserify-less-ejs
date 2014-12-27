(function() {
  var productsRoute;

  productsRoute = function(params) {
    this.app = params.app;
    return this.app.get('/products', function(req, res) {
      return res.send('products route index 2');
    });
  };

  module.exports = productsRoute;

}).call(this);
