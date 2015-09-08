/**
 * Base DTOs
 *
 * @author Patrick Stadler <patrick.stadler@gmail.com>
 */
'use strict';

var util = require('util')
  , errors = require('./errors');

/**
 * Base DTO class
 *
 * @abstract
 * @param {Object} data typically an HTTP response body
 * @param {Object} mapping Mapping of keys to field types
 *
 * @throws MappingError if mapping is missing
 * @throws MissingPropertyError if a property is missing in the response
 */
function BaseDTO(data, mapping) {
  if(!mapping) {
    throw new errors.MappingError('BaseDTO requires a mapping');
  }
  for(var k in mapping) {
    var options = mapping[k].options || {};
    var mappingName = options.mappingName || k;
    var value = data[mappingName] !== undefined ? data[mappingName] : options['default'];
    if(value === undefined) {
      throw new errors.MissingPropertyError('Missing property "' + mappingName + '". ' +
                         'Fix DTO definition to prevent this error.');
    }
    this[k] = mapping[k].fn(value);
  }

  this._rawData = data;
}

/**
 * Base List DTO class

 * @abstract
 * @param {Object} data typically an HTTP response body
 * @param {BaseDTO} DTO class to be applied on list elements
 *
 * @throws InvalidArgumentError if DTOClass is not inheriting from BaseDTO
 * @throws InvalidPropertyError if a property is missing or the response is not of type Array
 */
function BaseListDTO(data, DTOClass) {
  if(!(DTOClass.prototype instanceof BaseDTO)) {
    throw new errors.InvalidArgumentError('ListDTO requires a valid DTO class as second parameter');
  }
  if(!Array.isArray(data)) {
    throw new errors.InvalidPropertyError('ListDTO requires an array as first parameter');
  }
  this.list = data.map(function listMap(item) {
    return new DTOClass(item);
  });
  this._rawData = data;
}
// this is to check if <Some>DTO instanceof BaseDTO
util.inherits(BaseListDTO, BaseDTO);

module.exports = {
  BaseDTO: BaseDTO,
  BaseListDTO: BaseListDTO
};
