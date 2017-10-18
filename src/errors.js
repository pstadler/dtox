/**
 * Common DTO errors
 *
 * @author Patrick Stadler <patrick.stadler@gmail.com>
 * @author Michael Weibel <michael.weibel@gmail.com>
 */

/**
 * Base error
 *
 * Uses babel-plugin-transform-builtin-extend to support extending builtin type Error
 *
 * @param {string} msg error message
 */
class BaseError extends Error {}

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
