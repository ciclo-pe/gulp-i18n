'use strict';


const Path = require('path');
const Through = require('through2');
const MessageFormat = require('messageformat');
const Gutil = require('gulp-util');
const Yaml = require('js-yaml');
const Marked = require('marked');


module.exports = function (options) {

  const locales = {};

  const parse = function (file, encoding, next) {

    const relativeParts = file.relative.split('/');
    const ext = relativeParts[relativeParts.length - 1].split('.').pop();
    const message = {
      locale: relativeParts.shift(),
      namespace: relativeParts.join('/').replace(/\.[^.]*$/, '').replace(/\\/g, '/'),
      data: null
    };

    try {
      if (ext === 'yml') {
         message.data = Yaml.safeLoad(file.contents.toString());
      }
      else {
        message.data = JSON.parse(file.contents.toString());
      }

      Object.keys(message.data || {}).forEach((key) => {

        // Convert Markdown to HTML if string contains new line char.
        if (message.data[key] && message.data[key].indexOf('\n') >= 0) {
          message.data[key] = Marked(message.data[key].trim(), {
            breaks: true
          });
        }
      });
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
      let compiled = 'window.i18n = ' + mf.functions() + ';';

      Object.keys(data).forEach((namespace) => {

        compiled += '\n\nwindow.i18n[' + JSON.stringify(namespace) + '] = ';
        compiled += mf.precompileObject(data[namespace]) + ';';
      })

      this.push(new Gutil.File({
        path: locale + '.js',
        contents: new Buffer(compiled)
      }));
    });

    cb();
  };

  return Through.obj(parse, flush);
};

