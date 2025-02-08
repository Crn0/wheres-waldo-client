import BaseError from './base-error';

export default class FieldError extends BaseError {
  constructor(message, errors, httpCode, name = 'Validation Error') {
    super(message, errors, httpCode, name);
  }
}
