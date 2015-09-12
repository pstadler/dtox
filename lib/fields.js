/**
 * DTO Fields
 *
 * @author Patrick Stadler <patrick.stadler@gmail.com>
 */
'use strict';

var BaseDTO = require('./dto').BaseDTO
  , errors = require('./errors');

/**
 * Field options definition
 *
 * @typedef {Object} fieldOptions
 * @property {*} [default] default value
 * @property {String} [key] property name in the data object
 */
// no code here, just the typedef doc block

/**
 * Generic field
 *
 * Takes and returns value of any type.
 *
 * @param {Object} [options] to be used in mapping
 * @returns {Object,Function<Object>} to be used in mapping
 */
function generic(options) {
  return {
    options: options,
    fn: function(val) {
      return val;
    }
  };
}

/**
 * String field
 *
 * Takes and returns string values.
 *
 * @param {Object} [options] to be used in mapping
 * @returns {Object,Function<Object>} to be used in mapping
 *
 * @throws InvalidPropertyError if property has wrong type
 */
function string(options) {
  return {
    options: options,
    fn: function(val) {
      if(typeof val !== 'string') {
        throw new errors.InvalidPropertyError('Property of type string required');
      }

      return val;
    }
  };
}

/**
 * Boolean field
 *
 * Takes and returns boolean values.
 *
 * @param {Object} [options] to be used in mapping
 * @returns {Object,Function<Object>} to be used in mapping
 *
 * @throws InvalidPropertyError if property has wrong type
 */
function boolean(options) {
  return {
    options: options,
    fn: function(val) {
      if(typeof val !== 'boolean') {
        throw new errors.InvalidPropertyError('Property of type boolean required');
      }

      return val;
    }
  };
}

/**
 * Number field
 *
 * Takes and returns number values.
 *
 * @param {Object} [options] to be used in mapping
 * @returns {Object,Function<number>} to be used in mapping
 *
 * @throws InvalidPropertyError if property has wrong type
 */
function number(options) {
  return {
    options: options,
    fn: function(val) {
      if(typeof val !== 'number') {
        throw new errors.InvalidPropertyError('Property of type number required');
      }

      return val;
    }
  };
}

/**
 * Date field
 *
 * Takes and returns date values.
 *
 * @param {Object} [options] to be used in mapping
 * @returns {Object,Function<Date>} to be used in mapping
 */
function date(options) {
  return {
    options: options,
    fn: function(val) {
      return Date.parse(val);
    }
  };
}

/**
 * List field
 *
 * Takes and returns Arrays
 *
 * @param {Object} [options] to be used in mapping
 * @return {Object,Function<Array>} to be used in mapping
 *
 * @throws InvalidPropertyError if property has wrong type
 */
function list(options) {
  return {
    options: options,
    fn: function(val) {
      if(!Array.isArray(val)) {
        throw new errors.InvalidPropertyError('Property of type array required');
      }

      return val;
    }
  };
}

/**
 * List field which converts its items to DTOs
 *
 * @param {BaseDTO} DTOClass to be applied to items
 * @param {Object} [options] to be used in mapping
 * @return {Object,Function<DTO>} to be called in mapping
 *
 * @throws InvalidArgumentError if DTOClass is not inheriting from BaseDTO
 * @throws InvalidPropertyError if property has wrong type
 */
function listWithDTO(DTOClass, options) {
  if(!(DTOClass.prototype instanceof BaseDTO)) {
    throw new errors.InvalidArgumentError('Valid DTO class required');
  }

  return {
    options: options,
    fn: function applylistWithDTO(val) {
      if(!Array.isArray(val)) {
        throw new errors.InvalidPropertyError('Property of type array required');
      }

      return val.map(function(item) {
        return new DTOClass(item);
      });
    }
  };
}

/**
 * Object field with an own DTO to be able to add mapping
 *
 * @param {BaseDTO} DTOClass to be applied to items
 * @param {Object} [options] Options
 *
 * @throws InvalidArgumentError if DTOClass is not inheriting from BaseDTO
 * @throws InvalidPropertyError if property has wrong type
 */
function objectWithDTO(DTOClass, options) {
  if(!(DTOClass.prototype instanceof BaseDTO)) {
    throw new errors.InvalidArgumentError('Valid DTO class required');
  }

  return {
    options: options,
    fn: function applyObjectWithDTO(data) {
      // this should be treated as an optional field if options.default is set to null
      if(!data && options.default === null) {
        return options.default;
      }

      if(!data && !options.default) {
        throw new errors.MissingPropertyError('Required property is missing');
      }

      return new DTOClass(data || options.default);
    }
  };
}

module.exports = {
  generic: generic,
  string: string,
  boolean: boolean,
  number: number,
  date: date,
  list: list,
  listWithDTO: listWithDTO,
  objectWithDTO: objectWithDTO
};
