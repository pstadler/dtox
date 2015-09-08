/**
 * Common DTO errors
 *
 * @author Patrick Stadler <patrick.stadler@gmail.com>
 */
'use strict';

var util = require('util');

/**
 * Base error
 *
 * @param {string} msg error message
 */
function BaseError(msg) {
  BaseError.super_.call(this, msg);
  Error.captureStackTrace(this, this.constructor);
  this.message = msg;
  this.name = this.constructor.name;
}
util.inherits(BaseError, Error);

/**
 * Mapping error
 *
 * @param {string} msg error message
 */
function MappingError(msg) {
  MappingError.super_.call(this, msg);
  Error.captureStackTrace(this, this.constructor);
  this.message = msg;
  this.name = this.constructor.name;
}
util.inherits(MappingError, BaseError);

/**
 * Invalid argument error
 *
 * @param {string} msg error message
 */
function InvalidArgumentError(msg) {
  InvalidArgumentError.super_.call(this, msg);
  Error.captureStackTrace(this, this.constructor);
  this.message = msg;
  this.name = this.constructor.name;
}
util.inherits(InvalidArgumentError, BaseError);

/**
 * Invalid property error
 *
 * @param {string} msg error message
 */
function InvalidPropertyError(msg) {
  InvalidPropertyError.super_.call(this, msg);
  Error.captureStackTrace(this, this.constructor);
  this.message = msg;
  this.name = this.constructor.name;
}
util.inherits(InvalidPropertyError, BaseError);

/**
 * Missing property error
 *
 * @param {string} msg error message
 */
function MissingPropertyError(msg) {
  MissingPropertyError.super_.call(this, msg);
  Error.captureStackTrace(this, this.constructor);
  this.message = msg;
  this.name = this.constructor.name;
}
util.inherits(MissingPropertyError, BaseError);


module.exports = {
  MappingError: MappingError,
  InvalidArgumentError: InvalidArgumentError,
  InvalidPropertyError: InvalidPropertyError,
  MissingPropertyError: MissingPropertyError
};
