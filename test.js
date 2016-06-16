/*eslint no-eval:0 */
'use strict';


const Os = require('os');
const Path = require('path');
const Assert = require('assert');
const File = require('vinyl');
const I18n = require('./');


const internals = {
  tmpdir: Os.tmpdir()
};


describe('gulp-i18n', () => {

  describe('in streaming mode', () => {

    it('should compile json file', (done) => {

      const fakeFile = new File({
        cwd: internals.tmpdir,
        path: Path.join(internals.tmpdir, 'en', 'test.json'),
        contents: Buffer.from(JSON.stringify({ foo: 'bar' }))
      });

      const i18n = I18n();

      i18n.once('data', (file) => {

        const fn = eval('(function () {' +
          '\nvar window = {};' +
          '\n' + file.contents.toString() + ';' +
          '\nreturn window.i18n;' +
          '\n})');

        const compiled = fn();
        Assert.equal(compiled.test.foo(), 'bar');

        done();
      });

      i18n.end(fakeFile);
    });


    it('should compile yml file', (done) => {

      const fakeFile = new File({
        cwd: internals.tmpdir,
        path: Path.join(internals.tmpdir, 'en', 'test.yml'),
        contents: Buffer.from('foo: bar')
      });

      const i18n = I18n();

      i18n.once('data', (file) => {

        const fn = eval('(function () {' +
          '\nvar window = {};' +
          '\n' + file.contents.toString() + ';' +
          '\nreturn window.i18n;' +
          '\n})');

        const compiled = fn();
        Assert.equal(compiled.test.foo(), 'bar');

        done();
      });

      i18n.end(fakeFile);
    });

  });

});

