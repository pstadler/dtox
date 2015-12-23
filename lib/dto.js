/**
 * Base DTO classes
 *
 * @author Patrick Stadler <patrick.stadler@gmail.com>
 */
'use strict';

var inherits = require('inherits')
  , extend = require('util-extend')
  , errors = require('./errors');

/**
 * Base DTO class
 *
 * @class BaseDTO
 *
 * @param {Object} data typically a JSON object
 * @param {Object} mapping
 *
 * @throws MappingError if mapping is missing
 * @throws MissingPropertyError if a property is missing
 */
function BaseDTO(data, mapping) {
  var mappingKeys = Object.keys(mapping || {});

  if(mappingKeys.length === 0) {
    throw new errors.MappingError('Mapping required');
  }

  var self = this;

  mappingKeys.forEach(function(k) {
    var options = mapping[k].options || {};
    var key = options.key || k;
    var value = data[key] !== undefined ? data[key] : options.default;

    if(value === undefined) {
      throw new errors.MissingPropertyError('Required property "' + key + '" is missing');
    }

    self[k] = mapping[k].fn(value);
  });

  this.__RAW__ = data;
}

function fieldFn(Class, name, field) {
  if(!name || !field) {
    throw new errors.InvalidArgumentError('Two arguments required: name, field');
  }
  Class.__MAPPING__[name] = field;
}

function inheritFn(SuperClass, mapping) {
  function Class(data) {
    if(!this) {
      throw new errors.BaseError('Constructor called without creating a new instance');
    }
    Class.super_.call(this, data, this.constructor.__MAPPING__);
  }

  inherits(Class, SuperClass);

  Class.__MAPPING__ = extend({}, mapping || SuperClass.__MAPPING__);
  Class.field = fieldFn.bind(null, Class);
  Class.inherit = inheritFn.bind(null, Class);

  return Class;
}

/**
 * Inherit from DTO
 *
 * @param {Object} [mapping] field definitions
 * @returns {BaseDTO} subclass of BaseDTO
 */
BaseDTO.inherit = inheritFn.bind(null, BaseDTO);

/**
 * Register a field
 *
 * @param {string} name
 * @param {fieldOptions} [mapping]
 *
 * @throws InvalidArgumentError if either name or field is missing
 */
BaseDTO.field = fieldFn.bind(null, BaseDTO);


/**
 * Base List DTO class
 *
 * @class BaseListDTO
 *
 * @param {Object} data typically a JSON object
 * @param {BaseDTO} DTOClass to be applied on list elements
 *
 * @throws InvalidArgumentError if DTOClass is not inheriting from BaseDTO
 * @throws InvalidPropertyError if a property is missing or the response is not of type Array
 */
function BaseListDTO(data, DTOClass) {
  if(!(DTOClass && DTOClass.prototype instanceof BaseDTO)) {
    throw new errors.InvalidArgumentError('Valid DTO class required');
  }

  if(!Array.isArray(data)) {
    throw new errors.InvalidPropertyError('Property of type array required');
  }

  this.items = data.map(function mapItems(item) {
    return new DTOClass(item);
  });

  this.__RAW__ = data;
}

function inheritListFn(SuperClass, DTOClass) {
  function Class(data) {
    if(!this) {
      throw new errors.BaseError('Constructor called without creating a new instance');
    }

    Class.super_.call(this, data, this.constructor.__DTOClass__);
  }

  Class.prototype = SuperClass;
  Class.__DTOClass__ = DTOClass || SuperClass.__DTOClass__;
  Class.inherit = inheritListFn.bind(null, Class);

  inherits(Class, SuperClass);

  return Class;
}

inherits(BaseListDTO, BaseDTO);

/**
 * Inherit from List DTO
 *
 * @param {BaseDTO} DTOClass to be applied on each item
 * @returns {BaseListDTO} subclass of BaseListDTO
 */
BaseListDTO.inherit = inheritListFn.bind(null, BaseListDTO);

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
 * @param {mixed}
 * @returns {mixed}
 */
methods.forEach(function(method) {
  BaseListDTO.prototype[method] = function() {
    return [][method].apply(this.items || [], arguments);
  };
});

module.exports = {
  BaseDTO: BaseDTO,
  BaseListDTO: BaseListDTO
};
