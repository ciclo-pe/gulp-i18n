'use strict';


const Path = require('path');
const Through = require('through2');
const MessageFormat = require('messageformat');
const Gutil = require('gulp-util');


const internals = {};


module.exports = function (options) {

  const locales = {};

  const parse = function (file, encoding, next) {

    const relativeParts = file.relative.split('/');
    const message = {
      locale: relativeParts.shift(),
      namespace: relativeParts.join('/').replace(/\.[^.]*$/, '').replace(/\\/g, '/'),
      data: null
    };

    try {
      message.data = JSON.parse(file.contents.toString());
    }
    catch (err) {
      console.error(err);
    }

    locales[message.locale] = locales[message.locale] || {};
    locales[message.locale][message.namespace] = message.data;

    next();
  };

  const flush = function (cb) {

    Object.keys(locales).forEach((locale) => {

      const mf = new MessageFormat(locale);
      const data = locales[locale];
      let compiled = 'window.i18n = {\n';
      let count = 0;

      Object.keys(data).forEach((namespace) => {

        if (count++) {
          compiled += '\n,\n';
        }

        compiled += JSON.stringify(namespace) + ': ';
        compiled += mf.precompileObject(data[namespace]);
      })

      compiled += '\n};';

      this.push(new Gutil.File({
        path: locale + '.js',
        contents: new Buffer(compiled)
      }));
    });

    cb();
  };

  return Through.obj(parse, flush);
};

