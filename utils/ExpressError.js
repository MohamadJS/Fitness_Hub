class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        // This.message/statusCode is equal to whatever message/statusCode was sent in
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;