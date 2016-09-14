# gulp-i18n

[![NPM](https://nodei.co/npm/gulp-i18n.png?compact=true)](https://nodei.co/npm/gulp-i18n/)

[![Build Status](https://travis-ci.org/ciclo-pe/gulp-i18n.svg?branch=master)](https://travis-ci.org/ciclo-pe/gulp-i18n)
[![Dependency Status](https://david-dm.org/ciclo-pe/gulp-i18n.svg?style=flat)](https://david-dm.org/ciclo-pe/gulp-i18n)
[![devDependency Status](https://david-dm.org/ciclo-pe/gulp-i18n/dev-status.png)](https://david-dm.org/ciclo-pe/gulp-i18n#info=devDependencies)

Compile `json` files using [`messageformat.js`](https://github.com/SlexAxton/messageformat.js).

## Install

```
npm install --save-dev gulp-i18n
```

## Example

1. Create `json` files with translations
2. Build with `gulp`
3. Load appropriate script in browser

### 1. Create `json` files with translations

Example file structure:

```
.
├── gulpfile.js
├── i18n
│   ├── en
│   │   ├── inicio.json
│   │   └── menu.json
│   └── es
│       ├── inicio.json
│       └── menu.json
├── package.json
└── www
    ├── i18n
    │   ├── en.js
    │   └── es.js
    └── index.html
```

Example `i18n/en/menu.json` file:

```json
{
  "ubicación": "Location",
  "instalaciones": "The House",
  "actividades": "Ammenities",
  "galería": "Gallery",
  "contacto": "Contact"
}
```

### 2. Build with `gulp`

In your `gulpfile.js`:

```js
'use strict';

const Gulp = require('gulp');
const I18n = require('gulp-i18n');

Gulp.task('i18n', () => {

  Gulp.src('i18n/**/*.json')
    .pipe(I18n())
    .pipe(Gulp.dest('www/i18n/'));
});
```

Run task with `gulp`:

```
$ gulp i18n
```

### 3. Load appropriate script in browser

```html
<html>
  <body>
    <script>
    var locale = localStorage.getItem('locale') || 'es';

    $('<script>')
      .attr('src', '/i18n/' + locale + '.js')
      .appendTo('body');

    // You can now use the global `i18n` object.
    console.log(window.i18n.menu['ubicación']());
    // This would show "Ubicación" or "Location" depending on
    // selected `locale`.
    </script>
  </body>
</html>
```
