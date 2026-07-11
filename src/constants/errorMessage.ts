export enum ErrorMessage {

    INVALID_TOKEN = "Invalid or expired token.",
    TOKEN_REQUIRED = "The bearer token is required.",

    INVALID_LOGIN_CODE = "Invalid code.",
    LOGIN_CODE_ALREADY_USED = "Code already used",
    EXPIRED_LOGIN_CODE = "Expired code",
    TO_MUCH_ATTEMPTS = "To much attempts, try again later.",

    EMAIL_ALREADY_USED = "Email already in use."
}