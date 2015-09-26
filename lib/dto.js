/**
 * Base DTOs
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
 * @abstract
 * @param {Object} data typically an HTTP response body
 * @param {Object} mapping Mapping of keys to field types
 *
 * @throws MappingError if mapping is missing
 * @throws MissingPropertyError if a property is missing
 */
function BaseDTO(data, mapping) {
  var mappingKeys = Object.keys(mapping);

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

function inheritFn(BaseClass, mapping) {
  function Class(data) {
    if(!this) {
      throw new errors.BaseError('Constructor called without creating a new instance');
    }
    Class.super_.call(this, data, this.constructor.__MAPPING__);
  }

  inherits(Class, BaseClass);

  Class.__MAPPING__ = extend({}, mapping || BaseClass.__MAPPING__);
  Class.field = fieldFn.bind(null, Class);
  Class.inherit = inheritFn.bind(null, Class);

  return Class;
}

/**
 * TODO: docs
 */
BaseDTO.inherit = inheritFn.bind(null, BaseDTO);

/**
 * TODO: docs
 *
 * @throws InvalidArgumentError if either name or field is missing
 */
BaseDTO.field = fieldFn.bind(null, BaseDTO);


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
    throw new errors.InvalidArgumentError('Valid DTO class required');
  }

  if(!Array.isArray(data)) {
    throw new errors.InvalidPropertyError('Property of type array required');
  }

  this.list = data.map(function listMap(item) {
    return new DTOClass(item);
  });

  this.__RAW__ = data;
}

function inheritListFn(BaseClass, DTOClass) {
  function Class(data) {
    if(!this) {
      throw new errors.BaseError('Constructor called without creating a new instance');
    }

    Class.super_.call(this, data, this.constructor.__DTOClass__);
  }

  Class.__DTOClass__ = DTOClass || BaseClass.__DTOClass__;
  Class.inherit = inheritListFn.bind(null, Class);

  inherits(Class, BaseClass);

  return Class;
}

/**
 * TODO: docs
 */
BaseListDTO.inherit = inheritListFn.bind(null, BaseListDTO);

inherits(BaseListDTO, BaseDTO);

module.exports = {
  BaseDTO: BaseDTO,
  BaseListDTO: BaseListDTO
};
