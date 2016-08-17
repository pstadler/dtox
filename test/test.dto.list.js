'use strict';

/* eslint-disable no-unused-expressions, no-new, new-cap */

const expect = require('chai').expect;

const { BaseDTO, BaseListDTO, fields, errors } = require('../');

describe('BaseListDTO', function() {
  const MAPPING = {
    string: fields.string(),
    withDefault: fields.generic({ default: 'default value' }),
    mappedValue: fields.generic({ default: null, key: 'keyOfMappedValue' })
  };

  class TestDTO extends BaseDTO {
    constructor(data) {
      super(data, MAPPING);
    }
  }
  class TestListDTO extends BaseListDTO {
    constructor(data) {
      super(data, TestDTO);
    }
  }

  it('inherits from parent classes', function() {
    expect(TestListDTO.prototype).to.be.an.instanceof(BaseListDTO);
  });

  it('throws if DTO class is missing', function() {
    expect(function() { new BaseListDTO({}); }).to.throw(errors.InvalidArgumentError);
  });

  it('handles data correctly', function() {
    const data = [
      { string: 'test' },
      { string: 'test2' },
      { string: 'test3' }
    ];

    const instance = new TestListDTO(data);

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

    const data = [
      { string: 'test' },
      { notstring: 'test2' },
      { string: 'test3' }
    ];

    expect(function() { new TestListDTO(data); }).to.throw(errors.MissingPropertyError);
  });

  it('Array helpers exist', function() {
    const instance = new TestListDTO([]);

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
    const data = [
      { string: 'test' },
      { string: 'test2' },
      { string: 'test3' }
    ];

    const mapFn = function(v, k) {
      return k + ':' + v.string;
    };

    let instance = new TestListDTO(data);
    expect(instance.map(mapFn)).to.deep.equal(['0:test', '1:test2', '2:test3']);
    expect(instance.map(mapFn)).to.deep.equal(data.map(mapFn));

    instance = new TestListDTO([]);
    expect(instance.map(mapFn)).to.deep.equal([].map(mapFn));
  });

  it('serialises correctly to JSON', function() {
    const data = [
      { string: 'test' },
      { string: 'test2' },
      { string: 'test3' }
    ];

    const instance = new TestListDTO(data);

    expect(JSON.parse(JSON.stringify(instance))).to.deep.equal([
      { string: 'test', withDefault: 'default value', mappedValue: null },
      { string: 'test2', withDefault: 'default value', mappedValue: null },
      { string: 'test3', withDefault: 'default value', mappedValue: null }
    ]);
  });

  it('is iterable', function() {
    const data = [
      { string: 'test' },
      { string: 'test2' },
      { string: 'test3' }
    ];

    const instance = new TestListDTO(data);

    const dtos = [...instance];

    for(let dto of dtos) {
      expect(dto).to.be.an.instanceOf(TestDTO);
    }
  });
});
