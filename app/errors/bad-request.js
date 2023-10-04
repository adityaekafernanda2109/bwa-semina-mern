const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api-error');

class BadRequestError extends CustomAPIError {
    constructor(message) {
        super(message);
        // memberikan statusCode Bad Request
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

module.exports = BadRequestError;