'use strict';

/*eslint-disable no-unused-expressions, no-new */

const expect = require('chai').expect;

const { BaseDTO, fields, errors } = require('../');
const utils = require('./utils');

describe('fields', function() {
  it('contain correct properties', function() {
    utils.eachField(function(field) {
      expect(field().fn).to.be.a('function');
      expect(field().options).to.deep.equal({});
    });
  });

  it('correctly handle values', function() {
    utils.eachField(function(field, type) {
      const testVal = utils.valueForType(type);
      let resultVal = field().fn(testVal);

      if(type === 'listWithDTO') {
        resultVal = [{ fieldInMapping: resultVal[0].fieldInMapping }];
      } else if(type === 'objectWithDTO') {
        resultVal = { fieldInMapping: resultVal.fieldInMapping };
      }

      expect(resultVal).to.not.be.null;
      expect(resultVal).to.deep.equal(testVal);
    });
  });

  it('correctly stores default values', function() {
    utils.eachField(function(field, type) {
      const defaultVal = utils.valueForType(type);

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
        const testVal = utils.valueForType(type);
        expect(fields.generic().fn(testVal)).to.deep.equal(testVal);
      });
    });
  });

  describe('#string', function() {
    it('takes only values of type string', function() {
      utils.fieldTypes.forEach(function(type) {
        const testVal = utils.valueForType(type);

        if(['string', 'generic'].indexOf(type) !== -1) {
          expect(fields.string().fn(testVal)).to.be.a('string');
          return;
        }

        expect(function() { fields.string().fn(testVal); }).to.throw(errors.InvalidPropertyError);
      });
    });
  });

  describe('#boolean', function() {
    it('takes only values of type boolean', function() {
      utils.fieldTypes.forEach(function(type) {
        const testVal = utils.valueForType(type);

        if(['boolean'].indexOf(type) !== -1) {
          expect(fields.boolean().fn(testVal)).to.be.a('boolean');
          return;
        }

        expect(function() { fields.boolean().fn(testVal); }).to.throw(errors.InvalidPropertyError);
      });
    });
  });

  describe('#number', function() {
    it('takes only values of type number', function() {
      utils.fieldTypes.forEach(function(type) {
        const testVal = utils.valueForType(type);

        if(['number'].indexOf(type) !== -1) {
          expect(fields.number().fn(testVal)).to.be.a('number');
          return;
        }

        expect(function() { fields.number().fn(testVal); }).to.throw(errors.InvalidPropertyError);
      });
    });
  });

  describe('#date', function() {
    it('takes only values of type date', function() {
      utils.fieldTypes.forEach(function(type) {
        const testVal = utils.valueForType(type);

        if(['date', 'number'].indexOf(type) !== -1) {
          expect(fields.date().fn(testVal)).to.be.an.instanceof(Date);
          return;
        }

        expect(function() { fields.date().fn(testVal); }).to.throw(errors.InvalidPropertyError);
      });
    });
  });

  describe('#list', function() {
    it('takes only values of type list', function() {
      const field = fields.list();

      utils.fieldTypes.forEach(function(type) {
        const testVal = utils.valueForType(type);

        if(['list', 'listWithDTO'].indexOf(type) !== -1) {
          expect(field.fn(testVal)).to.be.an.instanceof(Array);
          return;
        }

        expect(function() { field.fn(testVal); }).to.throw(errors.InvalidPropertyError);
      });
    });
  });

  describe('#listWithDTO', function() {
    it('takes only values of type list', function() {
      class fieldDTO extends BaseDTO {
        constructor(data) {
          super(data, {
            fieldInMapping: fields.generic()
          });
        }
      }
      const field = fields.listWithDTO(fieldDTO);

      utils.fieldTypes.forEach(function(type) {
        const testVal = utils.valueForType(type);

        if(['list', 'listWithDTO'].indexOf(type) !== -1) {
          expect(field.fn(testVal)).to.be.an.instanceof(Array);
          return;
        }

        expect(function() { field.fn(testVal); }).to.throw(errors.InvalidPropertyError);
      });
    });

    it('throws when DTO argument is missing', function() {
      expect(function() { fields.listWithDTO(); }).to.throw(errors.InvalidArgumentError);
    });
  });

  describe('#objectWithDTO', function() {
    it('takes only valid objects', function() {
      class TestDTO extends BaseDTO {
        constructor(data) {
          super(data, {
            fieldInMapping: fields.generic()
          });
        }
      }
      const field = fields.objectWithDTO(TestDTO);

      utils.fieldTypes.forEach(function(type) {
        const testVal = utils.valueForType(type);

        if(['objectWithDTO'].indexOf(type) !== -1) {
          expect(field.fn(testVal)).to.be.an.instanceof(TestDTO);
          return;
        }

        expect(function() { field.fn(testVal); }).to.throw(errors.MissingPropertyError);
      });
    });

    it('throws when DTO argument is missing', function() {
      expect(function() { fields.objectWithDTO(); }).to.throw(errors.InvalidArgumentError);
    });

    it('correctly handles missing data when default is `null`', function() {
      class TestDTO extends BaseDTO {
        constructor(data) {
          super(data, {
            fieldInMapping: fields.generic()
          });
        }
      }
      const field = fields.objectWithDTO(TestDTO, { default: null });
      expect(field.fn()).to.be.null;
    });
  });
});
