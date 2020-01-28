class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super();
        this.stack = statusCode;
        this.message = message;
    }
}
const handleError = (err, res) => {
    const { stack, message } = err;
    res.status(stack).json({
        status: stack,
        type:'error',
        message
    });
};
module.exports = {
    ErrorHandler,
    handleError
}