export class InvalidTokenException extends Error {
    
    constructor (readonly status: number, readonly message: string) {
        super (message);
    }
}