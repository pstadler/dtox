'use strict';

/*eslint-disable no-unused-expressions, no-new */

var expect = require('chai').expect;

var BaseListDTO = require('../lib/dto').BaseListDTO
  , BaseDTO = require('../lib/dto').BaseDTO
  , fields = require('../lib/fields')
  , errors = require('../lib/errors');

describe('BaseListDTO', function() {
  var MAPPING = {
    string: fields.string(),
    withDefault: fields.generic({ default: 'default value' }),
    mappedValue: fields.generic({ default: null, key: 'keyOfMappedValue' })
  };

  var TestDTO = BaseDTO.inherit(MAPPING)
    , TestListDTO = BaseListDTO.inherit(TestDTO);

  it('#inherit inherits from parent classes', function() {
    expect(BaseListDTO.prototype instanceof BaseDTO).to.be.true;
    expect(TestListDTO.prototype instanceof BaseListDTO).to.be.true;
    expect(TestListDTO.inherit().prototype instanceof TestListDTO).to.be.true;
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

    expect(instance.list).to.have.length(3);
    expect(instance.list[0] instanceof TestDTO).to.be.true;
    expect(instance.list[0].string).to.equal('test');
    expect(instance.list[1].string).to.equal('test2');
    expect(instance.list[2].string).to.equal('test3');

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

});
