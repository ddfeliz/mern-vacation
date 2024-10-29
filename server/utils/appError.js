class CreateError extends Error {
    constructor(statusCode, message) {  // Paramètres changés
        super(message);
        
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CreateError;  // Corrections de la casse
