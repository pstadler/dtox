/**
 * Base DTO classes
 *
 * @author Patrick Stadler <patrick.stadler@gmail.com>
 * @author Michael Weibel <michael.weibel@gmail.com>
 */
'use strict';

const { MappingError, MissingPropertyError, InvalidArgumentError, InvalidPropertyError } = require('./errors');

/**
 * Base DTO class
 */
class BaseDTO {
  /**
   * Construct a new BaseDTO
   *
   * @param {Object} data typically a JSON object
   * @param {Object} mapping
   *
   * @throws MappingError if mapping is missing
   * @throws MissingPropertyError if a property is missing
   */
  constructor(data, mapping) {
    const mappingKeys = Object.keys(mapping || {});

    if(mappingKeys.length === 0) {
      throw new MappingError('Mapping required');
    }

    mappingKeys.forEach(function(k) {
      const options = mapping[k].options || {};
      const key = options.key || k;
      let value;

      if(options.callback) {
        value = options.callback(data);
      }
      if(value === undefined) {
        value = data[key] !== undefined ? data[key] : options.default;
      }

      if(value === undefined) {
        throw new MissingPropertyError('Required property "' + key + '" is missing');
      }

      this[k] = mapping[k].fn(value);
    }, this);

    this.__RAW__ = data;
  }

  /**
   * Returns mapped values as an own object.
   *
   * @returns {Object}
   */
  toJSON() {
    const values = {};

    Object.keys(this)
      .filter(function(key) {
        return key !== '__RAW__';
      })
      .forEach(function(key) {
        values[key] = this[key];
      }, this);

    return values;
  }
}

/**
 * Base List DTO class
 */
class BaseListDTO {
  /**
   * Construct a new BaseListDTO
   *
   * @param {Object}  data     typically a JSON array
   * @param {BaseDTO} DTOClass to be applied on list elements
   *
   * @throws InvalidArgumentError if DTOClass is not inheriting from BaseDTO
   * @throws InvalidPropertyError if a property is missing or the response is not of type Array
   */
  constructor(data, DTOClass) {
    console.log(DTOClass, DTOClass instanceof BaseDTO);
    if(!(DTOClass && DTOClass instanceof BaseDTO)) {
      throw new InvalidArgumentError('Valid DTO class required');
    }

    if(!Array.isArray(data)) {
      throw new InvalidPropertyError('Property of type array required');
    }

    this.items = data.map(function mapItems(item) {
      return new DTOClass(item);
    });

    this.__RAW__ = data;
  }

  /**
   * Iterator protocol conformity.
   * @returns {Array}
   */
  [Symbol.iterator]() {
    return this.items;
  }

  /**
   * Returns the items when serialising.
   *
   * @returns {Array}
   */
  toJSON() {
    return this.items;
  }
}

var methods = [
  'concat',
  'every',
  'filter',
  'forEach',
  'indexOf',
  'join',
  'lastIndexOf',
  'map',
  'reduce',
  'reduceRight',
  'slice',
  'some'
];

/**
 * Standard array helper methods
 *
 * `#concat()`, `#every()`, `#filter()`, `#forEach()`, `#indexOf()`, `#join()`,
 * `#lastIndexOf()`, `#map()`, `#reduce()`, `#reduceRight()`, `#slice()`, `#some()`
 *
 * @param {*}
 * @returns {*}
 */
methods.forEach(function(method) {
  BaseListDTO.prototype[method] = function() {
    return [][method].apply(this.items || [], arguments);
  };
});

module.exports = {
  BaseDTO,
  BaseListDTO
};
