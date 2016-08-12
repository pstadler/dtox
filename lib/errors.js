/**
 * Common DTO errors
 *
 * @author Patrick Stadler <patrick.stadler@gmail.com>
 */
'use strict';

/**
 * Base error
 */
class BaseError extends Error {
  /**
   * @param {string} message error message
   */
  constructor(message) {
    super(message);

    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    this.message = message;
    this.name = this.constructor.name;
  }
}

/**
 * Mapping error
 */
class MappingError extends BaseError {
  /**
   * @param {string} message error message
   */
  constructor(message) {
    super(message);
  }
}

/**
 * Invalid argument error
 */
class InvalidArgumentError extends BaseError {
  /**
   * @param {string} message error message
   */
  constructor(message) {
    super(message);
  }
}

/**
 * Invalid property error
 */
class InvalidPropertyError extends BaseError {
  /**
   * @param {string} message error message
   */
  constructor(message) {
    super(message);
  }
}

/**
 * Missing property error
 */
class MissingPropertyError extends BaseError {
  /**
   * @param {string} message error message
   */
  constructor(message) {
    super(message);
  }
}

module.exports = {
  BaseError,
  MappingError,
  InvalidArgumentError,
  InvalidPropertyError,
  MissingPropertyError
};
