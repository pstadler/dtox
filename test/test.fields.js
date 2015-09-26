'use strict';

/*eslint-disable no-unused-expressions, no-new */

var expect = require('chai').expect;

var BaseDTO = require('../lib/dto').BaseDTO
  , fields = require('../lib/fields')
  , errors = require('../lib/errors')
  , utils = require('./utils');

describe('fields', function() {
  it('contain correct properties', function() {
    utils.eachField(function(field) {
      expect(typeof field().fn).to.equal('function');
      expect(field().options).to.deep.equal({});
    });
  });

  it('correctly handle values', function() {
    utils.eachField(function(field, type) {
      var testVal = utils.valueForType(type);
      var resultVal = field().fn(testVal);

      if(type === 'listWithDTO') {
        resultVal = [{ fieldInMapping: resultVal[0].fieldInMapping }];
      } else if(type === 'objectWithDTO') {
        resultVal = { fieldInMapping: resultVal.fieldInMapping };
      }

      expect(resultVal).to.not.be.null;
      expect(resultVal).to.deep.equal(testVal);
    });
  });

  it('correctly store default values', function() {
    utils.eachField(function(field, type) {
      var defaultVal = utils.valueForType(type);

      expect(field({ default: defaultVal }).options.default).to.not.be.null;
      expect(field({ default: defaultVal }).options.default).to.deep.equal(defaultVal);
    });
  });

  it('correctly handles `undefined` values', function() {
    utils.eachField(function(field) {
      expect(function() { field().fn(undefined); }).to.throw(errors.InvalidPropertyError);
    });
  });

  it('correctly handles `null` values', function() {
    utils.eachField(function(field) {
      expect(field().fn(null)).to.be.equal(null);
    });
  });

  describe('#generic', function() {
    it('takes values of any kind', function() {
      utils.fieldTypes.forEach(function(type) {
        var testVal = utils.valueForType(type);
        expect(fields.generic().fn(testVal)).to.deep.equal(testVal);
      });
    });
  });

  describe('#string', function() {
    it('takes only values of type string', function() {
      utils.fieldTypes.forEach(function(type) {
        var testVal = utils.valueForType(type);

        if(['string', 'generic'].indexOf(type) !== -1) {
          expect(typeof fields.string().fn(testVal)).to.equal('string');
          return;
        }

        expect(function() { fields.string().fn(testVal); }).to.throw(errors.InvalidPropertyError);
      });
    });
  });

  describe('#boolean', function() {
    it('takes only values of type boolean', function() {
      utils.fieldTypes.forEach(function(type) {
        var testVal = utils.valueForType(type);

        if(['boolean'].indexOf(type) !== -1) {
          expect(typeof fields.boolean().fn(testVal)).to.equal('boolean');
          return;
        }

        expect(function() { fields.boolean().fn(testVal); }).to.throw(errors.InvalidPropertyError);
      });
    });
  });

  describe('#number', function() {
    it('takes only values of type number', function() {
      utils.fieldTypes.forEach(function(type) {
        var testVal = utils.valueForType(type);

        if(['number'].indexOf(type) !== -1) {
          expect(typeof fields.number().fn(testVal)).to.equal('number');
          return;
        }

        expect(function() { fields.number().fn(testVal); }).to.throw(errors.InvalidPropertyError);
      });
    });
  });

  describe('#date', function() {
    it('takes only values of type date', function() {
      utils.fieldTypes.forEach(function(type) {
        var testVal = utils.valueForType(type);

        if(['date', 'number'].indexOf(type) !== -1) {
          expect(fields.date().fn(testVal)instanceof Date).to.be.true;
          return;
        }

        expect(function() { fields.date().fn(testVal); }).to.throw(errors.InvalidPropertyError);
      });
    });
  });

  describe('#list', function() {
    it('takes only values of type list', function() {
      utils.fieldTypes.forEach(function(type) {
        var testVal = utils.valueForType(type);

        if(['list', 'listWithDTO'].indexOf(type) !== -1) {
          expect(fields.list().fn(testVal) instanceof Array).to.be.true;
          return;
        }

        expect(function() { fields.list().fn(testVal); }).to.throw(errors.InvalidPropertyError);
      });
    });
  });

  describe('#listWithDTO', function() {
    it('takes only values of type list', function() {
      utils.fieldTypes.forEach(function(type) {
        var testVal = utils.valueForType(type);

        if(['list', 'listWithDTO'].indexOf(type) !== -1) {
          var field = fields.listWithDTO(BaseDTO.inherit({ fieldInMapping: fields.generic() }));
          expect(field.fn(testVal) instanceof Array).to.be.true;
          return;
        }

        expect(function() { fields.list().fn(testVal); }).to.throw(errors.InvalidPropertyError);
      });
    });
  });

  describe('#objectWithDTO', function() {
    it('takes only valid objects', function() {
      utils.fieldTypes.forEach(function(type) {
        var testVal = utils.valueForType(type);
        var TestDTO = BaseDTO.inherit({ fieldInMapping: fields.generic() });
        var field = fields.objectWithDTO(TestDTO);

        if(['objectWithDTO'].indexOf(type) !== -1) {
          expect(field.fn(testVal) instanceof TestDTO).to.be.true;
          return;
        }

        expect(function() { field.fn(testVal); }).to.throw(errors.MissingPropertyError);
      });
    });
  });
});
