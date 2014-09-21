A minimal nodejs app skeleton built with

* express
* gulp 
* coffeescript
* nodemon
* ejs
* browserify
* less
* live-reload

Deliberately lightweight and client app framework free (apart from browserify) - Intended as a base to add your own preferred bits and pieces.

Setup:
```
git clone https://github.com/diffused/gulp-coffee-browserify-less-ejs.git
cd gulp-coffee-browserify-less-ejs
npm install
gulp
```

Gulp will build the server and client side apps, templates, assets, etc and watch and live-reload any changes.

Tweak the code in `./src` and gulp will build it into `./app` 


Server side app:
```
'src/app/app.coffee'
# main entry. builds -> app/app.js 


'src/app/views/*.ejs'
# ejs views builds -> app/views/*.ejs


'src/app/routes'
# add new routes. Follow the pattern in productsRoute.coffee if you want to have routes added dynamically

```

Client side app:
```
'src/client/*.ejs'
# builds -> app/public/*.ejs

'src/client/scripts/main.coffee`
# main browserified file. builds -> app/public/scripts/app.js

'src/client/stylesheets/main.less`
# main lesscss entry file. builds -> app/public/stylesheets/main.css

# bower installs into app/public/bower_components

```



