/**
 * Common DTO errors
 *
 * @author Patrick Stadler <patrick.stadler@gmail.com>
 * @author Michael Weibel <michael.weibel@gmail.com>
 */

const inherits = require('inherits')

/**
 * Base error
 *
 * Still in ES5 style because of http://stackoverflow.com/q/33870684/315242
 * (instanceof with babel transpiling doesn't work on native classes)
 *
 * @param {string} msg error message
 */
function BaseError (msg) {
  BaseError.super_.call(this, msg)
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor)
  }
  this.message = msg
  this.name = this.constructor.name
}

inherits(BaseError, Error)

/**
 * Mapping error
 */
class MappingError extends BaseError {
}

/**
 * Invalid argument error
 */
class InvalidArgumentError extends BaseError {
}

/**
 * Invalid property error
 */
class InvalidPropertyError extends BaseError {
}

/**
 * Missing property error
 */
class MissingPropertyError extends BaseError {
}

module.exports = {
  MappingError,
  InvalidArgumentError,
  InvalidPropertyError,
  MissingPropertyError
}
