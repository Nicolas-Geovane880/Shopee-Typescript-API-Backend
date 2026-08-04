export enum ErrorMessage {

    INVALID_TOKEN = "Token inválido ou expirado",
    INVALID_REFRESH_TOKEN = "Refresh Token inválido ou expirado",
    REFRESH_TOKEN_NOT_FOUND = "Refresh Token não encontrado",
    TOKEN_REQUIRED = "The bearer token is required",
    INVALID_CREDENTIALS = "Credenciais inválidas",

    INVALID_LOGIN_CODE = "Código inválido",
    LOGIN_CODE_ALREADY_USED = "Código já utilizado",
    EXPIRED_LOGIN_CODE = "Código expirado",
    TO_MUCH_ATTEMPTS = "Muitas tentativas, tente novamente mais tarde",
    AWAIT_TO_ATTEMPT = "Espere um momento para tentar novamente",
    LOGIN_CHALLENGE_NOT_FOUND = "Tentativa de login não encontrada",

    EMAIL_ALREADY_USED = "Email já em uso",

    USER_NOT_FOUND = "Usuário não encontrado",
    ORDER_NOT_FOUND = "Pedido não encontrado",
}