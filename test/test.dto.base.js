'use strict';

/* eslint-disable no-unused-expressions, no-new */

const expect = require('chai').expect;

const { BaseDTO, fields, errors } = require('../');

describe('BaseDTO', function() {
  const MAPPING = {
    string: fields.string(),
    withDefault: fields.generic({ default: 'default value' }),
    mappedValue: fields.generic({ default: null, key: 'keyOfMappedValue' }),
    callbackValue: fields.generic({
      callback: function(data) {
        return data.callbackValue + 'test';
      }
    }),
    callbackValueUndefined: fields.generic({
      default: 'foo',
      callback: function() {
        return undefined;
      }
    })
  };
  class TestDTO extends BaseDTO {
    constructor(data) {
      super(data, MAPPING);
    }
  }

  it('inherits from parent classes', function() {
    expect(TestDTO.prototype).to.be.an.instanceof(BaseDTO);
  });

  it('throws if mapping is missing', function() {
    expect(function() { new BaseDTO(); }).to.throw(errors.MappingError);
  });

  it('takes valid data', function() {
    const instance = new TestDTO({ string: 'foobar' });
    expect(instance.string).to.equal('foobar');
  });

  it('handles `null` values', function() {
    const instance = new TestDTO({ string: null });
    expect(instance.string).to.equal(null);
  });

  it('ignores superfluous data', function() {
    const instance = new TestDTO({ string: 'foobar', string2: 'foobar' });
    expect(instance).to.not.have.property('string2');
  });

  it('handles default values', function() {
    let instance = new TestDTO({ string: 'foobar' });
    expect(instance.withDefault).to.equal('default value');

    instance = new TestDTO({ string: 'foobar', withDefault: 'not default' });
    expect(instance.withDefault).to.equal('not default');
  });

  it('handles values with mapped keys', function() {
    let instance = new TestDTO({ string: 'foobar', keyOfMappedValue: 'test' });
    expect(instance.mappedValue).to.equal('test');

    instance = new TestDTO({ string: 'foobar', mappedValue: 'test' });
    expect(instance.mappedValue).to.be.null;
  });

  it('throws on missing data', function() {
    expect(function() { new TestDTO({ some: 'foobar' }); }).to.throw(errors.MissingPropertyError);
  });

  it('throws on invalid data', function() {
    expect(function() { new TestDTO([]); }).to.throw(errors.MissingPropertyError);
  });

  it('stores raw data', function() {
    const instance = new TestDTO({ string: 'foobar', string2: 'foobar' });
    expect(Object.keys(instance.__RAW__)).to.have.length(2);
  });

  it('uses callback for init', function() {
    const instance = new TestDTO({ string: 'test', callbackValue: 'cbValue' });
    expect(instance.callbackValue).to.equal('cbValuetest');
  });

  it('uses default value if callback returns undefined', function() {
    const instance = new TestDTO({ string: 'test' });
    expect(instance.callbackValueUndefined).to.equal('foo');
  });

  it('serialises correctly to JSON', function() {
    const instance = new TestDTO({string: 'foobar', callbackValue: 'cbValue'});
    expect(JSON.parse(JSON.stringify(instance))).to.deep.equal({
      string: 'foobar',
      withDefault: 'default value',
      mappedValue: null,
      callbackValue: 'cbValuetest',
      callbackValueUndefined: 'foo'
    });
  });
});
