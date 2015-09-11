/**
 * Base DTOs
 *
 * @author Patrick Stadler <patrick.stadler@gmail.com>
 */
'use strict';

var util = require('util')
  , errors = require('./errors');


function fieldFor(Class) {
  return function registerField(name, field) {
    if(!name || !field) {
      throw new errors.InvalidArgumentError('field takes two arguments: name, field');
    }

    Class.__mapping[name] = field;
  };
}

function inheritFrom(BaseClass) {
  return function inherit(mapping) {
    var Class = function(data) {
      Class.super_.call(this, data, Class.__mapping);
    };

    Class.__mapping = mapping || BaseClass.__mapping || {};
    Class.field = fieldFor(Class);
    Class.inherit = inheritFrom(Class);

    util.inherits(Class, BaseClass);

    return Class;
  };
}

/**
 * Base DTO class
 *
 * @abstract
 * @param {Object} data typically an HTTP response body
 * @param {?Object} mapping Mapping of keys to field types
 *
 * @throws MappingError if mapping is missing
 * @throws MissingPropertyError if a property is missing
 */
function BaseDTO(data, mapping) {
  if(Object.keys(mapping).length === 0) {
    throw new errors.MappingError('Mapping required');
  }

  for(var k in mapping) {
    var options = mapping[k].options || {};
    var key = options.key || k;
    var value = data[key] !== undefined ? data[key] : options.default;

    if(value === undefined) {
      throw new errors.MissingPropertyError('Missing property "' + key + '". ' +
                         'Fix DTO definition to prevent this error.');
    }

    this[k] = mapping[k].fn(value);
  }

  this.__raw = data;
}

/**
 * TODO: docs
 */
BaseDTO.inherit = inheritFrom(BaseDTO);

/**
 * TODO: docs
 *
 * @throws InvalidArgumentError if either name or field is missing
 */
BaseDTO.field = fieldFor(BaseDTO);


function inheritFromList(BaseClass) {
  return function inherit(DTOClass) {
    var Class = function(data) {
      Class.super_.call(this, data, Class.__DTOClass);
    };

    Class.__DTOClass = DTOClass || BaseClass.__DTOClass;
    Class.inherit = inheritFrom(Class);

    util.inherits(Class, BaseClass);

    return Class;
  };
}

/**
 * Base List DTO class
 *
 * @abstract
 * @param {Object} data typically an HTTP response body
 * @param {BaseDTO} DTO class to be applied on list elements
 *
 * @throws InvalidArgumentError if DTOClass is not inheriting from BaseDTO
 * @throws InvalidPropertyError if a property is missing or the response is not of type Array
 */
function BaseListDTO(data, DTOClass) {
  if(!(DTOClass && DTOClass.prototype instanceof BaseDTO)) {
    throw new errors.InvalidArgumentError('ListDTO requires a valid DTO class');
  }

  if(!Array.isArray(data)) {
    throw new errors.InvalidPropertyError('ListDTO requires a property of type array');
  }

  this.list = data.map(function listMap(item) {
    return new DTOClass(item);
  });

  this.__raw = data;
}

util.inherits(BaseListDTO, BaseDTO);

/**
 * TODO: docs
 */
BaseListDTO.inherit = inheritFromList(BaseListDTO);

module.exports = {
  BaseDTO: BaseDTO,
  BaseListDTO: BaseListDTO
};
