'use strict';

/* eslint-disable no-unused-expressions, no-new */

var expect = require('chai').expect;

var dtox = require('../')
  , BaseDTO = dtox.BaseDTO
  , fields = dtox.fields
  , errors = dtox.errors;

describe('BaseDTO', function() {
  var MAPPING = {
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
  var TestDTO = BaseDTO.inherit(MAPPING);

  it('#inherit inherits from parent classes', function() {
    expect(TestDTO.prototype).to.be.an.instanceof(BaseDTO);
    expect(TestDTO.inherit().prototype).to.be.an.instanceof(TestDTO);
  });

  it('#inherit inherits mappings', function() {
    var mappingKeys = Object.keys(TestDTO.inherit().__MAPPING__);
    expect(mappingKeys).to.deep.equal([
      'string',
      'withDefault',
      'mappedValue',
      'callbackValue',
      'callbackValueUndefined'
    ]);
    expect(TestDTO.inherit({}).__MAPPING__).to.deep.equal({});
  });

  it('#field registers fields', function() {
    var SomeDTO = BaseDTO.inherit();
    SomeDTO.field('prop', fields.string());

    var instance = new SomeDTO({ prop: 'foobar' });
    expect(instance.prop).to.equal('foobar');

    var AnotherDTO = TestDTO.inherit();
    AnotherDTO.field('prop', fields.string());

    instance = new AnotherDTO({ prop: 'foo', string: 'bar' });
    expect(instance.prop).to.equal('foo');
    expect(instance.string).to.equal('bar');
  });

  it('#field throws if argument is missing', function() {
    var SomeDTO = BaseDTO.inherit();
    expect(function() { SomeDTO.field('name'); }).to.throw(errors.InvalidArgumentError);
  });

  it('throws if constructor is called without "new"', function() {
    expect(function() { BaseDTO.inherit()(); }).to.throw(errors.BaseError);
  });

  it('throws if mapping is missing', function() {
    expect(function() { new (BaseDTO.inherit())(); }).to.throw(errors.MappingError);
  });

  it('takes valid data', function() {
    var instance = new TestDTO({ string: 'foobar' });
    expect(instance.string).to.equal('foobar');
  });

  it('handles `null` values', function() {
    var instance = new TestDTO({ string: null });
    expect(instance.string).to.equal(null);
  });

  it('ignores superfluous data', function() {
    var instance = new TestDTO({ string: 'foobar', string2: 'foobar' });
    expect(instance).to.not.have.property('string2');
  });

  it('handles default values', function() {
    var instance = new TestDTO({ string: 'foobar' });
    expect(instance.withDefault).to.equal('default value');

    instance = new TestDTO({ string: 'foobar', withDefault: 'not default' });
    expect(instance.withDefault).to.equal('not default');
  });

  it('handles values with mapped keys', function() {
    var instance = new TestDTO({ string: 'foobar', keyOfMappedValue: 'test' });
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
    var instance = new TestDTO({ string: 'foobar', string2: 'foobar' });
    expect(Object.keys(instance.__RAW__)).to.have.length(2);
  });

  it('uses callback for init', function() {
    var instance = new TestDTO({ string: 'test', callbackValue: 'cbValue' });
    expect(instance.callbackValue).to.equal('cbValuetest');
  });

  it('uses default value if callback returns undefined', function() {
    var instance = new TestDTO({ string: 'test' });
    expect(instance.callbackValueUndefined).to.equal('foo');
  });

  it('serialises correctly to JSON', function() {
    var instance = new TestDTO({string: 'foobar', callbackValue: 'cbValue'});
    expect(JSON.parse(JSON.stringify(instance))).to.deep.equal({
      string: 'foobar',
      withDefault: 'default value',
      mappedValue: null,
      callbackValue: 'cbValuetest',
      callbackValueUndefined: 'foo'
    });
  });
});
