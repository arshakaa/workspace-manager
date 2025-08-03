const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    let statusCode = 500;
    let message = 'Internal server error';
    let error = 'Server error';

    if (err.code === 'ER_DUP_ENTRY') {
        statusCode = 409;
        message = 'Resource already exists';
        error = 'Duplicate entry';
    } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        statusCode = 400;
        message = 'Referenced resource does not exist';
        error = 'Foreign key constraint';
    } else if (err.name === 'ValidationError') {
        statusCode = 400;
        message = err.message;
        error = 'Validation error';
    } else if (err.statusCode) {
        statusCode = err.statusCode;
        message = err.message;
        error = err.error || 'Request error';
    }

    res.status(statusCode).json({
        error,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = {
    errorHandler,
};
