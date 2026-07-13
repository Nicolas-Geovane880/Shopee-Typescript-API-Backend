import { InvalidLoginCodeException } from "../exceptions/invalidLoginCodeException.js";
import type { NextFunction, Request, Response } from "express";
import type { InvalidTokenException } from "../exceptions/invalidTokenException.js";
import { ConflictException } from "../exceptions/conflictException.js";

const errorsMap: {[error: string] : (err: any) => any} = {
    InvalidTokenException: (err: InvalidTokenException) => ({
        status: err.status,
        message: err.message,
    }),
    InvalidLoginCodeException: (err: InvalidLoginCodeException) => ({
        status: err.status,
        message: err.message,
    }),
    ConflictException: (err: ConflictException) => ({
        status: err.status,
        message: err.message,
    }),
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const error = errorsMap[err.constructor.name];

    const errorResponse = error ? error (err) : {status: 500, message: err.message};
    
    res.status (errorResponse.status).json ({
        ...errorResponse,
        timestamp: new Date ().toISOString (),
        path: req.path,
        method: req.method,
    });
}