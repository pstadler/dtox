/**
 * DTO Fields
 *
 * @author Patrick Stadler <patrick.stadler@gmail.com>
 */
'use strict';

var BaseDTO = require('./dto').BaseDTO
  , errors = require('./errors');

/**
 * Field mapping options
 *
 * @typedef {Object} mappingOptions
 * @property {*}        [default]  default value
 * @property {string}   [key]      original property name
 * @property {Function} [callback] callback to initialise the field.
 *                                 If returns undefined, will take default if set.
 */
// no code here, just the typedef doc block

/**
 * Generic field
 *
 * Takes and returns value of any type.
 *
 * @param {mappingOptions} [options]
 * @returns {Object} containing options / fn to be used during mapping
 *
 * @throws InvalidPropertyError if property is empty
 */
function generic(options) {
  return {
    options: options || {},
    fn: function(val) {
      if(val === undefined) {
        throw new errors.InvalidPropertyError('Required property is missing');
      }

      return val;
    }
  };
}

/**
 * String field
 *
 * Takes and returns string values.
 *
 * @param {mappingOptions} [options]
 * @returns {Object} containing options / fn to be used during mapping
 *
 * @throws InvalidPropertyError if property has wrong type
 */
function string(options) {
  return {
    options: options || {},
    fn: function(val) {
      if(val !== null && typeof val !== 'string') {
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
 * @param {mappingOptions} [options]
 * @returns {Object} containing options / fn to be used during mapping
 *
 * @throws InvalidPropertyError if property has wrong type
 */
function boolean(options) {
  return {
    options: options || {},
    fn: function(val) {
      if(val !== null && typeof val !== 'boolean') {
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
 * @param {mappingOptions} [options]
 * @returns {Object} containing options / fn to be used during mapping
 *
 * @throws InvalidPropertyError if property has wrong type
 */
function number(options) {
  return {
    options: options || {},
    fn: function(val) {
      if(val !== null && typeof val !== 'number') {
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
 * @param {mappingOptions} [options]
 * @returns {Object} containing options / fn to be used during mapping
 *
 * @throws InvalidPropertyError if property is empty or not parsable to a date
 */
function date(options) {
  return {
    options: options || {},
    fn: function(val) {
      if(val === null) {
        return val;
      }

      if(val === undefined) {
        throw new errors.InvalidPropertyError('Required property is missing');
      }

      // booleans can be parsed to dates
      if(typeof val === 'boolean') {
        throw new errors.InvalidPropertyError('Property cannot be converted to a date');
      }

      if(val instanceof Date) {
        return val;
      }

      val = new Date(val);

      if(val.toString() === 'Invalid Date') {
        throw new errors.InvalidPropertyError('Property cannot be converted to a date');
      }

      return val;
    }
  };
}

/**
 * List field
 *
 * Takes and returns arrays
 *
 * @param {mappingOptions} [options]
 * @return {Object} containing options / fn to be used during mapping
 *
 * @throws InvalidPropertyError if property has wrong type
 */
function list(options) {
  return {
    options: options || {},
    fn: function(val) {
      if(val !== null && !Array.isArray(val)) {
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
 * @param {mappingOptions} [options]
 * @return {Object} to be called during mapping
 *
 * @throws InvalidArgumentError if DTOClass is not inheriting from BaseDTO
 * @throws InvalidPropertyError if property has wrong type
 */
function listWithDTO(DTOClass, options) {
  if(!(DTOClass && DTOClass.prototype instanceof BaseDTO)) {
    throw new errors.InvalidArgumentError('Valid DTO class required');
  }

  options = options || {};

  return {
    options: options,
    fn: function applylistWithDTO(val) {
      if(val === null) {
        return val;
      }

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
 * @param {mappingOptions} [options] Options
 *
 * @throws InvalidArgumentError if DTOClass is not inheriting from BaseDTO
 * @throws InvalidPropertyError if property has wrong type
 */
function objectWithDTO(DTOClass, options) {
  if(!(DTOClass && DTOClass.prototype instanceof BaseDTO)) {
    throw new errors.InvalidArgumentError('Valid DTO class required');
  }

  options = options || {};

  return {
    options: options,
    fn: function applyObjectWithDTO(val) {
      if(val === null) {
        return val;
      }

      // this should be treated as an optional field if options.default is set to null
      if(!val && options.default === null) {
        return options.default;
      }

      if(!val && !options.default) {
        throw new errors.InvalidPropertyError('Required property is missing');
      }

      return new DTOClass(val || options.default);
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
