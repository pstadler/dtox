/**
 * DTO Fields
 *
 * @author Patrick Stadler <patrick.stadler@gmail.com>
 */
'use strict';

var moment = require('moment')
  , BaseDTO = require('./dto').BaseDTO
  , errors = require('./errors');

/**
 * Field options definition
 *
 * @typedef {Object} fieldOptions
 * @property {*} [default] default value
 * @property {String} [mappingName] property name in the data object
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
        throw new errors.InvalidPropertyError('field requires a property of type String');
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
 * @returns {Object,Function<moment>} to be used in mapping
 */
function date(options) {
  return {
    options: options,
    fn: function(val) {
      if(typeof val === 'number') {
        return moment.unix(val);
      }

      return moment(val);
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
        throw new errors.InvalidPropertyError('list field requires a property of type Array');
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
    throw new errors.InvalidArgumentError('listWithDTO field requires a valid DTO class');
  }

  return {
    options: options,
    fn: function applylistWithDTO(val) {
      if(!Array.isArray(val)) {
        throw new errors.InvalidPropertyError('listWithDTO field requires a property of type Array');
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
    throw new errors.InvalidArgumentError('objectWithDTO requires a valid DTO class');
  }

  return {
    options: options,
    fn: function applyObjectWithDTO(data) {
      // this should be treated as an optional field if options.default is set to null
      if(!data && options.default === null) {
        return options.default;
      }

      if(!data && !options.default) {
        throw new errors.InvalidPropertyError('objectWithDTO has no default set ,' +
                                        'but data is not available');
      }

      return new DTOClass(data || options.default);
    }
  };
}

module.exports = {
  generic: generic,
  string: string,
  date: date,
  list: list,
  listWithDTO: listWithDTO,
  objectWithDTO: objectWithDTO
};
