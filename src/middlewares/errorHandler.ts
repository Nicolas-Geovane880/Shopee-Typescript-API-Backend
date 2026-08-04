import { InvalidLoginCodeException } from "../exceptions/invalidLoginCodeException.js";
import type { Request, Response } from "express";
import type { InvalidTokenException } from "../exceptions/invalidTokenException.js";
import { ConflictException } from "../exceptions/conflictException.js";
import { InvalidCredentialsException } from "../exceptions/invalidCredentials.js";
import { ResourceNotFound } from "../exceptions/resourceNotFound.js";

const errorsMap: {[error: string] : (err: any) => any} = {
    InvalidTokenException: (err: InvalidTokenException) => ({
        status: err.status,
        message: err.message,
    }),
    InvalidLoginCodeException: (err: InvalidLoginCodeException) => ({
        status: err.status,
        message: err.message,
    }),
    InvalidCredentialsException: (err: InvalidCredentialsException) => ({
        status: err.status,
        message: err.message,
    }),
    ConflictException: (err: ConflictException) => ({
        status: err.status,
        message: err.message,
    }),
    ResourceNotFound: (err: ResourceNotFound) => ({
        status: err.status,
        message: err.message,
    }),
}

export const errorHandler = (err: Error, req: Request, res: Response) => {
    const error = errorsMap[err.constructor.name];

    const errorResponse = error ? error (err) : {status: 500, message: err.message};
    
    if (errorResponse.status === 500) {
        console.log (errorResponse);
    }

    res.status (errorResponse.status).json ({
        ...errorResponse,
        timestamp: new Date ().toISOString (),
        path: req.path,
        method: req.method,
    });
}