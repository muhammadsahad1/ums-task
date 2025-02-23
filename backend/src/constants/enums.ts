// constant reuse 
// initalize httpstatus reuse 

export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    CONFLICT = 409,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}