'use strict';

/*eslint-disable no-unused-expressions, no-new */

var expect = require('chai').expect;

var dtox = require('../')
  , BaseDTO = dtox.BaseDTO
  , BaseListDTO = dtox.BaseListDTO
  , fields = dtox.fields
  , errors = dtox.errors;

describe('BaseListDTO', function() {
  var MAPPING = {
    string: fields.string(),
    withDefault: fields.generic({ default: 'default value' }),
    mappedValue: fields.generic({ default: null, key: 'keyOfMappedValue' })
  };

  var TestDTO = BaseDTO.inherit(MAPPING)
    , TestListDTO = BaseListDTO.inherit(TestDTO);

  it('#inherit inherits from parent classes', function() {
    expect(BaseListDTO.prototype).to.be.an.instanceof(BaseDTO);
    expect(TestListDTO.prototype).to.be.an.instanceof(BaseListDTO);
    expect(TestListDTO.inherit().prototype).to.be.an.instanceof(TestListDTO);
  });

  it('#inherit inherits DTO class from parent', function() {
    expect(TestListDTO.inherit().__DTOClass__.prototype.constructor).to.equal(TestDTO);
  });

  it('#inherit throws if DTO class is missing', function() {
    expect(function() { new (BaseListDTO.inherit())(); }).to.throw(errors.InvalidArgumentError);
  });

  it('throws if constructor is called without "new"', function() {
    expect(function() { TestListDTO(); }).to.throw(errors.BaseError);
  });

  it('handles data correctly', function() {
    var data = [
      { string: 'test' },
      { string: 'test2' },
      { string: 'test3' }
    ];

    var instance = new TestListDTO(data);

    expect(instance.items).to.have.length(3);
    expect(instance.items[0] instanceof TestDTO).to.be.true;
    expect(instance.items[0].string).to.equal('test');
    expect(instance.items[1].string).to.equal('test2');
    expect(instance.items[2].string).to.equal('test3');
  });

  it('handles empty list', function() {
    expect(function() { new TestListDTO([]); }).to.not.throw(Error);
  });

  it('throws on invalid data', function() {
    expect(function() { new TestListDTO({ string: 'a' }); }).to.throw(errors.InvalidPropertyError);

    var data = [
      { string: 'test' },
      { notstring: 'test2' },
      { string: 'test3' }
    ];

    expect(function() { new TestListDTO(data); }).to.throw(errors.MissingPropertyError);
  });

  it('Array helpers exist', function() {
    var instance = new TestListDTO([]);

    expect(instance.concat).to.be.a('function');
    expect(instance.every).to.be.a('function');
    expect(instance.filter).to.be.a('function');
    expect(instance.forEach).to.be.a('function');
    expect(instance.indexOf).to.be.a('function');
    expect(instance.join).to.be.a('function');
    expect(instance.lastIndexOf).to.be.a('function');
    expect(instance.map).to.be.a('function');
    expect(instance.reduce).to.be.a('function');
    expect(instance.reduceRight).to.be.a('function');
    expect(instance.slice).to.be.a('function');
    expect(instance.some).to.be.a('function');
  });

  // let's test a single Array helper at this point
  it('#map behaves like its native counterpart', function() {
    var data = [
      { string: 'test' },
      { string: 'test2' },
      { string: 'test3' }
    ];

    var mapFn = function(v, k) {
      return k + ':' + v.string;
    };

    var instance = new TestListDTO(data);
    expect(instance.map(mapFn)).to.deep.equal(['0:test', '1:test2', '2:test3']);
    expect(instance.map(mapFn)).to.deep.equal(data.map(mapFn));

    instance = new TestListDTO([]);
    expect(instance.map(mapFn)).to.deep.equal([].map(mapFn));
  });

});
